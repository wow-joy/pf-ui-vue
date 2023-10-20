<docs>

---
order: 7
title:
  zh-CN: 颜色完成选择
  en-US: Color completed selection
---

## zh-CN

颜色选择完成才会触发回调

## en-US

The callback will be called only when the color selection is completed.

</docs>

<template>
  <pf-color-picker :value="color" @changeComplete="handleChangeComplete" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Pfmessage } from '@pf-ui/pf-ui-vue';
const color = ref('#06AEA6');
const handleChangeComplete = newColor => {
  Pfmessage.success(`change color to ${newColor.toHexString()}`);
  color.value = newColor;
};
</script>
