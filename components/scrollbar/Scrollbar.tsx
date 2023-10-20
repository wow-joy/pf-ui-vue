import { defineComponent, PropType, ref, computed } from 'vue'
import {
  Scrollbar as BaseScrollbar,
  ScrollbarInst as InternalScrollbarInst,
  ExtractPublicPropTypes
} from './BaseScrollbar'

export interface ScrollTo {
  (x: number, y: number): void
  (options: { left?: number, top?: number, behavior?: ScrollBehavior }): void
}

export type ScrollBy = ScrollTo

export interface ScrollbarInst {
  scrollTo: ScrollTo
  scrollBy: ScrollBy
}

export const scrollbarProps = {
  trigger: String as PropType<'none' | 'hover'>,
  xScrollable: Boolean,
  onScroll: Function as PropType<(e: Event) => void>
} as const

export type ScrollbarProps = ExtractPublicPropTypes<typeof scrollbarProps>

const Scrollbar = defineComponent({
  name: 'PfScrollbar',
  props: scrollbarProps,
  setup () {
    const scrollbarInstRef = ref<InternalScrollbarInst | null>(null)
    const scrollContainer = computed(() => scrollbarInstRef.value?.containerRef)
    const scrollContent = computed(() => scrollbarInstRef.value?.contentRef)
    const exposedMethods: ScrollbarInst = {
      scrollTo: (...args: any[]) => {
        scrollbarInstRef.value?.scrollTo(args[0], args[1])
      },
      scrollBy: (...args: any[]) => {
        scrollbarInstRef.value?.scrollBy(args[0], args[1])
      }
    }
    return {
      ...exposedMethods,
      scrollbarInstRef,
      scrollContainer,
      scrollContent
    }
  },
  render () {
    return (
      <BaseScrollbar ref="scrollbarInstRef" {...this.$props} v-slots={this.$slots} />
    )
  }
})

export default Scrollbar