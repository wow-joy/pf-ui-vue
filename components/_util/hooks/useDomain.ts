let domain: string | undefined = undefined

export const setDomain = (_domain?: string) => {
  domain = _domain
}

const useDomain = () => {
  return domain
}

export default useDomain