import { defineComponent, computed, PropType, ExtractPropTypes } from 'vue'
import useConfigInject from '../_util/hooks/useConfigInject'
import classNames from '../_util/classNames'

export const simpleScrollbarProps = () => ({
  trigger: { type: String as PropType<'hover' | 'none'>, default: 'hover' },
  xScrollable: { type: Boolean as PropType<boolean>, default: true },
  yScrollable: { type: Boolean as PropType<boolean>, default: true },
  isAlwaysExist: { type: Boolean as PropType<boolean>, default: true }, // 滚动条是否始终占据体积
})

export type SimpleScrollbarProps = Partial<ExtractPropTypes<ReturnType<typeof simpleScrollbarProps>>>

const SimpleScrollbar = defineComponent({
  name: 'PfSimpleScrollbar',
  props: simpleScrollbarProps(),
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('scrollbar', props)
    const simpleScrollbarPrefixCls = `${prefixCls.value}-simple`

    const mergeCls = computed(() =>
      classNames({
        [simpleScrollbarPrefixCls]: true,
        [`${simpleScrollbarPrefixCls}-rtl`]: direction.value === 'rtl',
        [`${simpleScrollbarPrefixCls}-x`]: props.xScrollable,
        [`${simpleScrollbarPrefixCls}-y`]: props.yScrollable,
        [`${simpleScrollbarPrefixCls}-x-hover`]: props.trigger === 'hover' && !props.isAlwaysExist && props.xScrollable,
        [`${simpleScrollbarPrefixCls}-y-hover`]: props.trigger === 'hover' && !props.isAlwaysExist && props.yScrollable,
        [`${simpleScrollbarPrefixCls}-trigger-hover`]: props.trigger === 'hover' && props.isAlwaysExist
      })
    )

    return () => (
      <div class={mergeCls.value}>
        {slots?.default?.()}
      </div>
    )
  }
})

export default SimpleScrollbar