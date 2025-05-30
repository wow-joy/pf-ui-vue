<docs>
---
order: 5
title:
  zh-CN: 表格式下拉
  en-US: table drop
---

## zh-CN

表格式下拉

配置属性: tableDrop (参照下面例子), 可选valueKey(默认id), labelKey(默认name)
pf-select-table 部分原生属性会失效.

## en-US

表格式下拉

</docs>

<template>
  单选:
  <pf-select-table
    v-model:value="value"
    style="width: 100%"
    placeholder="Please select"
    showArrow
    allowClear
    :options="baseOptions"
    @change="handleChange"
    :tableDrop="[
      {
        label: 'name',
        title: '姓名',
        width: 100,
      },
      {
        label: 'age',
        title: '性别',
        width: 120,
      },
    ]"
    valueKey="id"
    labelKey="name"
  ></pf-select-table>
  <br />
  单选+搜索:
  <pf-select-table
    v-model:value="value"
    style="width: 100%"
    placeholder="Please select"
    showArrow
    allowClear
    showSearch
    @search="filter"
    :options="baseOptions"
    @change="handleChange"
    :tableDrop="[
      {
        label: 'name',
        title: '姓名',
        width: 100,
      },
      {
        label: 'age',
        title: '性别',
        width: 120,
      },
    ]"
    valueKey="id"
    labelKey="name"
  ></pf-select-table>
  <br />
  多选:
  <pf-select-table
    v-model:value="value1"
    style="width: 100%"
    placeholder="Please select"
    showArrow
    allowClear
    mode="multiple"
    :options="[...baseOptions]"
    @change="handleChange1"
    :tableDrop="[
      {
        label: 'name',
        title: '姓名',
        width: 100,
      },
      {
        label: 'age',
        title: '性别',
        width: 120,
      },
    ]"
    valueKey="id"
  ></pf-select-table>
  多选+搜索:
  <pf-select-table
    v-model:value="value2"
    style="width: 100%"
    placeholder="Please select"
    showArrow
    allowClear
    multiple
    showSearch
    @search="filter2"
    mode="multiple"
    :options="baseOptions"
    @change="handleChange2"
    :tableDrop="[
      {
        label: 'name',
        title: '姓名',
        width: 100,
      },
      {
        label: 'age',
        title: '性别',
        width: 120,
      },
    ]"
    valueKey="id"
  ></pf-select-table>
</template>
<script lang="ts">
import { set } from 'lodash';
import { defineComponent, nextTick, ref, unref, watch } from 'vue';
export default defineComponent({
  setup() {
    let data = [...Array(25)].map((_, i) => ({
      id: (i + 10).toString(36) + (i + 1),
      name: (i + 10).toString(36) + (i + 1),
      age: (i + 10).toString(36) + (i + 1),
    }));
    const value = ref('a1');
    const value1 = ref(['b2', 'c3']);
    const value2 = ref(['b2', 'c3']);

    watch(() => value.value, (v) => {
      console.log(`value changed: ${v}`);
    });
    const baseOptions = ref([...data]);
    const handleChange = (v: any) => {
      console.log(`selected ${v?.id}`);
      console.log(`selected value ${value.value}`);
      nextTick(() => {
        // value.value='b2';
        console.log(`selected ${value.value}`);
      });
    };
    const handleChange1 = (v: any) => {
      console.log(`handleChange1 selected ${v?.map((item: any) => item.id).join(', ')}`);
      nextTick(() => {
        // value1.value=['b2','c3'];
        console.log(`handleChange1 selected value1: ${value1.value?.join(', ')}`);
      });
    };
    const handleChange2 = (v: any) => {
      console.log(`handleChange1 selected ${v?.map((item: any) => item.id).join(', ')}`);
      nextTick(() => {
        // value1.value=['b2','c3'];
        console.log(`handleChange1 selected value1: ${value1.value?.join(', ')}`);
      });
    };
    const filter = (v: any) => {
      if (v === '' || v === undefined) {
        baseOptions.value = [...data];
        return;
      }
      let arr = baseOptions.value.filter(item => {
        return item.name.includes(v) || item.age.includes(v);
      });
      console.log(`search ${v}`, arr);
      baseOptions.value = arr;
    };
    const filter2 = (v: any) => {
      if (v === '' || v === undefined) {
        baseOptions.value = [...data];
        return;
      }
      let arr = baseOptions.value.filter(item => {
        return item.name.includes(v) || item.age.includes(v);
      });
      console.log(`search ${v}`, arr);
      baseOptions.value = arr;
    };
    return {
      handleChange,
      value,
      handleChange1,
      handleChange2,
      value1,
      filter,
      baseOptions,
      value2,
      filter2,
    };
  },
});
</script>
