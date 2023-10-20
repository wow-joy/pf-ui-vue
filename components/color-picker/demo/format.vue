<docs>
---
order: 5
title:
  zh-CN: 编码格式
  en-US: Encoding formats
---

## zh-CN

编码格式，支持`HEX`、`HSB`、`RGB`。

## en-US

Encoding formats, support `HEX`, `HSB`, `RGB`.

</docs>

<template>
  <pf-space direction="vertical" size="middle">
    <pf-row align="middle">
      <pf-space>
        <pf-col>
          <pf-color-picker
            v-model:value="colorHex"
            :format="formatHex"
            @formatChange="handleFormatChange"
          />
        </pf-col>
        <pf-col>
          HEX:
          <span>{{ hexString }}</span>
        </pf-col>
      </pf-space>
    </pf-row>
    <pf-row align="middle">
      <pf-space>
        <pf-col>
          <pf-color-picker
            v-model:value="colorHsb"
            :format="formatHsb"
            @formatChange="handleFormatChange"
          />
        </pf-col>
        <pf-col>
          HSB:
          <span>{{ hsbString }}</span>
        </pf-col>
      </pf-space>
    </pf-row>
    <pf-row align="middle">
      <pf-space>
        <pf-col>
          <pf-color-picker
            v-model:value="colorRgb"
            :format="formatRgb"
            @formatChange="handleFormatChange"
          />
        </pf-col>
        <pf-col>
          RGB:
          <span>{{ rgbString }}</span>
        </pf-col>
      </pf-space>
    </pf-row>
  </pf-space>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Color, ColorPickerProps } from '@pf-ui/pf-ui-vue/es/color-picker';

const colorHex = ref<Color | string>('#06aea6');
const colorHsb = ref<Color | string>('hsb(177, 97%, 68%)');
const colorRgb = ref<Color | string>('rgb(6, 174, 166)');
const formatHex = ref<ColorPickerProps['format']>('hex');
const formatHsb = ref<ColorPickerProps['format']>('hsb');
const formatRgb = ref<ColorPickerProps['format']>('rgb');

const hexString = computed(() =>
  typeof colorHex.value === 'string' ? colorHex.value : colorHex.value.toHexString(),
);

const hsbString = computed(() =>
  typeof colorHsb.value === 'string' ? colorHsb : colorHsb.value.toHsbString(),
);

const rgbString = computed(() =>
  typeof colorRgb.value === 'string' ? colorRgb : colorRgb.value.toRgbString(),
);

const handleFormatChange = (format: ColorPickerProps['format']) => {
  formatHex.value = format;
  formatHsb.value = format;
  formatRgb.value = format;
};
</script>
