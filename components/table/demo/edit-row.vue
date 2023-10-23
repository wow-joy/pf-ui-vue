<docs>
---
order: 24
title:
  en-US: Editable Rows
  zh-CN: 可编辑行
---

## zh-CN

带行编辑功能的表格。

## en-US

Table with editable rows.
</docs>

<template>
  <pf-table :columns="columns" :data-source="dataSource" bordered bodyNoPadding>
    <template #bodyCell="{ column, text, record }">
      <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
        <div class="edit-row">
          <pf-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][column.dataIndex]"
            style="height: 26px"
          />
          <div v-else>
            {{ text }}
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="edit-row editable-row-operations">
          <span v-if="editableData[record.key]">
            <pf-typography-link @click="save(record.key)">Save</pf-typography-link>
            <pf-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
              <a>Cancel</a>
            </pf-popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record.key)">Edit</a>
          </span>
        </div>
      </template>
    </template>
  </pf-table>
</template>
<script lang="ts">
import { cloneDeep } from 'lodash-es';
import { defineComponent, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%',
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
  },
];
interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
}
const data: DataItem[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default defineComponent({
  setup() {
    const dataSource = ref(data);
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

    const edit = (key: string) => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    };
    const save = (key: string) => {
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };
    const cancel = (key: string) => {
      delete editableData[key];
    };
    return {
      dataSource,
      columns,
      editingKey: '',
      editableData,
      edit,
      save,
      cancel,
    };
  },
});
</script>
<style scoped>
.edit-row {
  padding: 3px 10px;
}

.pf-table-row > .pf-table-cell:first-child > .edit-row {
  padding-left: 20px;
}

.pf-table-row > .pf-table-cell:last-child > .edit-row {
  padding-right: 20px;
}

.edit-row div {
  line-height: 26px;
}

.editable-row-operations a {
  margin-right: 8px;
}
</style>
