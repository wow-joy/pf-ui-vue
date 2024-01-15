<docs>
---
order: 12
title:
  zh-CN: 手动滚动
  en-US: Manual Scroll
---

## zh-CN

调用组件实例上的scrollIntoView可将指定行滚入视窗。
> 需要设置 rowKey 。

## en-US
.

</docs>

<template>
  <pf-table
    :columns="columns"
    :data-source="data"
    :pagination="{ pageSize: 50 }"
    :scroll="{ y: 240 }"
    rowKey="id"
    ref="tableRef"
  />
  <pf-space :size="20">
    <pf-input v-model:value="scrollKey" />
    <pf-button @click="handleScroll">滚动</pf-button>
  </pf-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [...Array(100)].map((_, i) => ({
  key: i,
  id: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

export default defineComponent({
  setup() {
    const tableRef = ref()
    const scrollKey = ref()
    const handleScroll = () => {
      scrollKey.value && tableRef.value.table.scrollIntoView(scrollKey.value)
    }
    return {
      data,
      columns,
      tableRef,
      scrollKey,
      handleScroll
    };
  },
});
</script>
  