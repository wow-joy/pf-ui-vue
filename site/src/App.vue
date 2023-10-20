<template>
  <pf-config-provider
    :locale="locale"
    :getTargetContainer="getTargetContainer"
    :getPopupContainer="getPopupContainer"
  >
    <pf-scrollbar ref="globalScrollRef" verticalRailStyle="z-index: 9999;">
      <router-view />
    </pf-scrollbar>
  </pf-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, provide, watch, ref } from 'vue';

import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useMediaQuery from './hooks/useMediaQuery';
import { GLOBAL_CONFIG } from './SymbolKey';
import enUS from '../../components/locale/en_US';
import zhCN from '../../components/locale/zh_CN';
import dayjs from 'dayjs';
import { getCurrColorObj, loadStyleString } from './colorObj';
import 'dayjs/locale/zh-cn';

function isZhCN(name: string) {
  return /-cn\/?$/.test(name);
}
export interface GlobalConfig {
  isMobile: Ref<boolean>;
  lang: Ref<'zh-CN' | 'en-US'>;
  isZhCN: Ref<boolean>;
  responsive: Ref<null | 'narrow' | 'crowded'>;
  blocked: Ref<boolean>;
}
const deleteHrefHash = (href?: string, hash?: string) => {
  if (!href) return undefined;
  if (!hash) return href;
  return href.split(hash)[0];
}
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();
    const colSize = useMediaQuery();
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');
    const theme = ref(localStorage.getItem('theme') || 'green');
    const globalScrollRef = ref(null);
    const responsive = computed(() => {
      if (colSize.value === 'xs') {
        return 'crowded';
      } else if (colSize.value === 'sm') {
        return 'narrow';
      }
      return null;
    });
    const globalConfig: GlobalConfig = {
      isMobile,
      responsive,
      lang: computed<any>(() => i18n.locale.value),
      isZhCN: computed(() => i18n.locale.value === 'zh-CN'),
      blocked: ref(false),
    };
    const changeTheme = (t: string) => {
      theme.value = t;
      localStorage.setItem('theme', t);
    };
    provide('themeMode', {
      theme,
      changeTheme,
    });
    provide(GLOBAL_CONFIG, globalConfig);
    watch(
      () => route.path,
      val => {
        i18n.locale.value = isZhCN(val) ? 'zh-CN' : 'en-US';
      },
      { immediate: true },
    );
    watch(
      globalConfig.isZhCN,
      val => {
        if (val) {
          dayjs.locale(zhCN.locale);
        } else {
          dayjs.locale(enUS.locale);
        }
      },
      { immediate: true },
    );
    const locale = computed(() => {
      return globalConfig.isZhCN.value ? zhCN : enUS;
    });
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'adsbox';
      document.body.appendChild(div);
      globalConfig.blocked.value = 'none' === getComputedStyle(div).display;
    }, 300);
    watch(
      theme,
      () => {
        let colorObj = {};
        let colorStr = '';
        if (theme.value === 'green') {
          colorObj = getCurrColorObj('#06AEA6');
        } else {
          colorObj= getCurrColorObj('#198EEB');
        }
        const key=Object.keys(colorObj);
        key.map((x) => {    
          let v = colorObj[x];
          if (v &&  typeof v === 'string' && v.startsWith("#")) {
            colorStr += ` --wj-${x}: ${v};`;
          }
        });
        colorStr=`:root {${colorStr}}`;
        loadStyleString(colorStr);
      },
      { immediate: true },
    );
    const getTargetContainer = () => globalScrollRef.value?.scrollContainer;
    // const getPopupContainer = triggerNode => triggerNode?.parentNode || document.body;
    const getPopupContainer = () => document.getElementsByClassName('main-container-component')?.[0] || document.body;

    router.afterEach((to, from) => {
      if (to && from) {
        const toPath = deleteHrefHash(to.fullPath, to.hash);
        const fromPath = deleteHrefHash(from.fullPath, from.hash);
        if (toPath && fromPath && toPath !== fromPath) {
          globalScrollRef.value?.scrollTo && globalScrollRef.value?.scrollTo(0, 0);
        }
      }
    });

    return {
      globalConfig,
      locale,
      globalScrollRef,
      getTargetContainer,
      getPopupContainer
    };
  },
  
});
</script>