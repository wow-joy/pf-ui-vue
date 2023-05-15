<docs>
---
order: 17
title:
  zh-CN: 打开面板时聚焦到选中日期
  en-US: Focus Value
---

## zh-CN

使用`focusValue`属性，可以在打开面板时聚焦到选中日期，若未选择日期，聚焦到当天。

## en-US

`focusValue`.

</docs>

<template>
  <pf-space direction="vertical" :size="12">
    <pf-date-picker v-model:value="value1" focusValue />
    <pf-date-picker v-model:value="value2" picker="week" focusValue />
    <pf-date-picker v-model:value="value3" picker="month" focusValue />
    <pf-date-picker v-model:value="value4" picker="quarter" focusValue />
    <pf-date-picker v-model:value="value5" picker="year" focusValue />
  </pf-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Dayjs } from 'dayjs';
export default defineComponent({
  setup() {
    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(),
      value5: ref<Dayjs>(),
    };
  },
});
</script>
  