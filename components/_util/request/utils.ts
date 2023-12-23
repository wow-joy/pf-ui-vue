import { stringify } from 'qs'

export function isArray(val?: any) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Array]'
}

export function isDate(val?: any) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Date]'
}

export function isObject(val?: any) {
  return val !== null && typeof val === 'object'
}

export function forEach2ObjArr(target?: any, callback?: any) {
  if (!target) return

  if (typeof target !== 'object') {
    target = [target]
  }

  if (isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback.call(null, target[i], i, target)
    }
  } else {
    for (let key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        callback.call(null, target[key], key, target)
      }
    }
  }
}

export function reqStringify(val: any) {
  return stringify(val, { arrayFormat: 'repeat', strictNullHandling: true })
}