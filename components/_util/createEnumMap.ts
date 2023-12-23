type IdType = number | string | boolean

export interface MapItem {
  id: IdType
  name: any
  [key: string]: any
}

interface OptionItem {
  value: any
  label: any
}

interface ToOptionOptions {
  include?: IdType[]
  exclude?: IdType[]
}

export interface MapArray<T> extends Array<T> {
  toOption: (options?: ToOptionOptions) => Array<OptionItem>
  findById: (id?: IdType) => MapItem
  findByName: (name?: any) => MapItem
  getName: (id?: IdType) => string | undefined
  getId: (name?: any) => IdType | undefined
}

const _MapFuns: unknown = {
  toOption (options?: ToOptionOptions) {
    let _this = this as MapItem[]
    // include exclude同时存在时只生效include
    if (options?.include) {
      _this = _this.filter(v => options?.include?.includes(v.id))
    } else if (options?.exclude) {
      _this = _this.filter(v => !options?.exclude?.includes(v.id))
    }

    return _this.map(v => ({
      value: v.id,
      label: v.name
    }))
  },
  findById (id?: IdType) {
    const [res] = (this as MapItem[]).filter(v => v.id === id)
    return res
  },
  findByName (name?: any) {
    const [res] = (this as MapItem[]).filter(v => v.name === name)
    return res
  },
  getName (id?: IdType) {
    const [res] = (this as MapItem[]).filter(v => v.id === id)
    return res?.name
  },
  getId (name?: any) {
    const [res] = (this as MapItem[]).filter(v => v.name === name)
    return res?.id
  }
}

const CreateEnumMap: (data: MapItem[]) => MapArray<MapItem> = data => {
  const _data = [...data]
  const proto = Object.getPrototypeOf(data)
  let _obj = Object.create(proto)
  Object.assign(_obj, _MapFuns)
  Object.setPrototypeOf(_data, _obj)
  return _data as MapArray<MapItem>
}

export default CreateEnumMap