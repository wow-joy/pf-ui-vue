let shadowRoot: ShadowRoot | undefined = undefined

export const setShadowRoot = (_shadowRoot?: ShadowRoot) => {
  shadowRoot = _shadowRoot
}

const useShadowRoot = () => {
  return shadowRoot
}

export default useShadowRoot