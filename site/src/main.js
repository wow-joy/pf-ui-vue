/* eslint-disable no-console */
import '../../components/style';
import 'docsearch.js/dist/cdn/docsearch.css';
import './index.less';
import 'nprogress/nprogress.css';
import { createApp, Transition, TransitionGroup, version as vueVersion } from 'vue';
import i18n from './i18n';
import NProgress from 'nprogress';
import router from './router';
import Antd, { Pfmessage } from '@pf-ui/pf-ui-vue';
import demoBox from './components/DemoBox.vue';
import demoContainer from './components/demoContainer.vue';
import demoSort from './components/demoSort.jsx';
import store from './store/index.js';
import clipboard from './directives/clipboard';
import App from './App.vue';
console.log('vue version: ', vueVersion);
console.log('pf-ui-vue version: ', Antd.version);
const app = createApp(App);

app.use(Antd);
app.use(clipboard);
app.component('Transition', Transition);
app.component('TransitionGroup', TransitionGroup);
app.component('DemoBox', demoBox);
app.component('DemoContainer', demoContainer);
app.component('DemoSort', demoSort);
app.component('VNodes', function (_, { attrs: { value } }) {
  return value;
});

Pfmessage.config({
  top: '50%',
  maxCount: 5,
  hoverRemain: true,
});

// app.component('tempVar', {
//   functional: true,
//   render: (h, ctx) => {
//     return ctx.scopedSlots && ctx.scopedSlots.default && ctx.scopedSlots.default(ctx.props);
//   },
// });

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    NProgress.done();
    document.documentElement.scrollTop = 0;
  }
});

app.use(store);
app.use(router);
app.use(i18n);

app.config.globalProperties.$i18n = i18n;

app.mount('#app');
