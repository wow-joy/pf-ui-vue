import { isArray, forEach2ObjArr, isObject, reqStringify, isDate } from './utils'
import { default as Pfmessage } from '../../message'

type Options = {
  data?: Record<string, any> | FormData
  params?: Record<string, any>
  requestType?: string
  includeCode?: string[] // 定义除了 0 以外能正常返回的code
  showErrorMessage?: boolean // 是否提示错误
} & Omit<RequestInit, 'body'>

type GetResponseOptions = Options & {
  getResponse: true // 返回原始response 为 true 的话返回 { data, response }
}

type GetFullDataOptions = Options & {
  getFullData: true // 是否返回完整的值
}

type GetFullDataAndResponseOptions = GetResponseOptions & GetFullDataOptions

type BlobDataOptions = Options & {
  responseType: 'blob'
}

type RequestResult<T> = {
  code: string
  data?: T
  message?: string
}

// 序列化params
const paramsSerialize = (params?: Record<string, any> | any[]) => {
  let serializedParams: string | undefined = undefined
  let jsonStringifiedParams: string | string[] | Record<string, any> | undefined = undefined

  if (params) {
    if (isArray(params)) {
      jsonStringifiedParams = []
      forEach2ObjArr(params, function(item: any) {
        if (item === null || typeof item === 'undefined') {
          (<string[]>jsonStringifiedParams).push(item)
        } else {
          (<string[]>jsonStringifiedParams).push(isObject(item) ? JSON.stringify(item) : item)
        }
      })

      serializedParams = reqStringify(jsonStringifiedParams)
    } else {
      jsonStringifiedParams = {}
      forEach2ObjArr(params, function(value: any, key: string) {
        let jsonStringifiedValue = value
        if (value === null || typeof value === 'undefined') {
          (<Record<string, any>>jsonStringifiedParams)[key] = value
        } else if (isDate(value)) {
          jsonStringifiedValue = value.toISOString()
        } else if (isArray(value)) {
          jsonStringifiedValue = value
        } else if (isObject(value)) {
          jsonStringifiedValue = JSON.stringify(value)
        }
        (<Record<string, any>>jsonStringifiedParams)[key] = jsonStringifiedValue
      })
      const tmp = reqStringify(jsonStringifiedParams)
      serializedParams = tmp
    }
  }

  return serializedParams
}

const defaultInit: RequestInit = {
  method: 'GET',
  credentials: 'include'
}

function Request<T = any>(url: string, options?: Options): Promise<T>
function Request<T = any>(url: string, options?: BlobDataOptions): Promise<Response>
function Request<T = any>(url: string, options?: GetResponseOptions): Promise<{
  response: Response
}> & Pick<RequestResult<T>, 'data'>
function Request<T = any>(url: string, options?: GetFullDataOptions): Promise<RequestResult<T>>
function Request<T = any>(url: string, options?: GetFullDataAndResponseOptions): Promise<{
  response: Response
  data?: RequestResult<T>
}>
function Request(url: string, options?: any) {
  const {
    data,
    params,
    requestType = 'json',
    getResponse,
    getFullData,
    includeCode,
    showErrorMessage = true,
    responseType,
    ..._init
  } = options || {}

  let _url = url
  const serializedParams = paramsSerialize(params)
  if (serializedParams) {
    const urlSign = url.indexOf('?') !== -1 ? '&' : '?'
    _url = `${url}${urlSign}${serializedParams}`
  }

  let init = {
    ...defaultInit,
    ..._init
  }
  init.method = options?.method?.toUpperCase() || 'GET'
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(init.method)) {
    const dataType = Object.prototype.toString.call(data)
    if (dataType === '[object, Object]' || dataType === '[object, Array]') {
      if (responseType === 'json') {
        init.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          ...init.headers
        }
        init.body = JSON.stringify(data)
      } else if (responseType === 'form') {
        init.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencodedw;charset=UTF-8',
          ...init.headers
        }
      } else {
        init.headers = {
          Accept: 'application/json',
          ...init.headers
        }
        init.body = data as any
      }
    }
  }

  return fetch(_url, init).then(async response => {
    if (response.status >= 200 && response.status < 300) {
      if (responseType === 'blob') {
        return response
      }

      const copy = response.clone()
      const dataJson = await copy.json()
      const { code, data } = dataJson || {}
      if (code === '0' || includeCode?.includes(code)) {
        const _data = getFullData ? dataJson : data
        return getResponse ? { data: _data, response: copy } : _data
      } else {
        throw dataJson
      }
    } else {
      const dataJson = await response.clone().json()
      throw dataJson
    }
  }).catch(error => {
    const errorMessage = typeof error === 'string' ? error : error?.message ? error?.message : false
    showErrorMessage && errorMessage && Pfmessage.error(errorMessage)
    throw error
  }) as any
}

export default Request