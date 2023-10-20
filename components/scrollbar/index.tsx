import type { App, Plugin } from 'vue'
import Scrollbar from './Scrollbar'
import SimpleScrollbar from './SimpleScrollbar'

export type { ScrollbarInst, ScrollbarProps } from './Scrollbar'
export { scrollbarProps } from './Scrollbar'
export type { SimpleScrollbarProps } from './SimpleScrollbar'
export { simpleScrollbarProps } from './SimpleScrollbar'

Scrollbar.SimpleScrollbar = SimpleScrollbar

Scrollbar.install = function (app: App) {
  app.component(Scrollbar.name, Scrollbar)
  app.component(Scrollbar.SimpleScrollbar.name, Scrollbar.SimpleScrollbar)
  return app
}

export {
  SimpleScrollbar
}

export default Scrollbar as typeof Scrollbar &
  Plugin & {
    readonly SimpleScrollbar: typeof SimpleScrollbar
  }