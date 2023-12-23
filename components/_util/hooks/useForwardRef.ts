import { getCurrentInstance } from 'vue'

export default () => {
  const instance = getCurrentInstance()
  function forwardRef(ref: any) {
    instance.exposed = ref
    instance.exposeProxy = ref
  }
  return forwardRef
}