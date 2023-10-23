<docs>
---
order: 6
title:
  en-US: Editable Cells
  zh-CN: 可编辑单元格
---

## zh-CN

带单元格编辑功能的表格。

## en-US

Table with editable cells.

</docs>

<template>
  <pf-button 
    type="primary" 
    class="editable-add-btn" 
    style="margin-bottom: 8px" 
    @click="handleAdd"
    minWidth="84px"
  >
    新增
  </pf-button>
  <pf-table bordered :data-source="dataSource" :columns="columns" bodyNoPadding>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell edit-row">
          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
            <pf-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" style="height: 26px" />
            <right-filled class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit2-filled class="editable-cell-icon" @click="edit(record.key)" />
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="static-row">
          <pf-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="onDelete(record.key)"
          >
            <a>Delete</a>
          </pf-popconfirm>
        </div>
      </template>
      <template v-else>
        <div class="static-row">{{ text }}</div>
      </template>
    </template>
  </pf-table>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import Edit2Filled from '@pf-ui/pf-icons-vue/Edit2Filled';
import RightFilled from '@pf-ui/pf-icons-vue/RightFilled';
import { cloneDeep } from 'lodash-es';

interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default defineComponent({
  components: {
    Edit2Filled,
    RightFilled,
  },
  setup() {
    const columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: 'age',
        dataIndex: 'age',
      },
      {
        title: 'address',
        dataIndex: 'address',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
      },
    ];
    const dataSource: Ref<DataItem[]> = ref([
      {
        key: '0',
        name: 'Edward King 0',
        age: 32,
        address: 'London, Park Lane no. 0',
      },
      {
        key: '1',
        name: 'Edward King 1',
        age: 32,
        address: 'London, Park Lane no. 1',
      },
    ]);
    const count = computed(() => dataSource.value.length + 1);
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

    const edit = (key: string) => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    };
    const save = (key: string) => {
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };

    const onDelete = (key: string) => {
      dataSource.value = dataSource.value.filter(item => item.key !== key);
    };
    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        name: `Edward King ${count.value}`,
        age: 32,
        address: `London, Park Lane no. ${count.value}`,
      };
      dataSource.value.push(newData);
    };

    return {
      columns,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      count,
      edit,
      save,
    };
  },
});
</script>
<style lang="less">

.edit-row {
  padding: 3px 10px 3px 20px;
}

.static-row {
  padding: 7.5px 10px;
}

.edit-row div {
  line-height: 26px;
}

.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    display: flex;
    align-items: center;
    padding-right: 24px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 16px;
    color: #999999;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
