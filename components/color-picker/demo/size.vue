<docs>
---
order: 8
title:
  zh-CN: 触发器尺寸大小
  en-US: Trigger size
---

## zh-CN

触发器有大、中、小三种尺寸，若不设置 size，则尺寸为中。

## en-US

The trigger has three sizes: large, medium and small. If size is not set, the size will be medium.
</docs>

<template>
  <pf-space>
    <pf-space direction="vertical">
      <pf-color-picker size="large" />
      <pf-color-picker />
      <pf-color-picker size="small" />
    </pf-space>
    <pf-space direction="vertical">
      <pf-color-picker size="large" show-text />
      <pf-color-picker show-text />
      <pf-color-picker size="small" show-text />
    </pf-space>
  </pf-space>
</template>
