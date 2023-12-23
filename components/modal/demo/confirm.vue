<docs>
---
order: 3
title:
  zh-CN: 确认对话框
  en-US: Confirmation modal dialog
---

## zh-CN

使用 `confirm()` 可以快捷地弹出确认框。

## en-US

To use `confirm()` to show a confirmation modal dialog.

</docs>

<template>
  <pf-space wrap>
    <pf-button @click="showConfirm">Confirm</pf-button>
    <pf-button @click="showPromiseConfirm">With promise</pf-button>
    <pf-button type="dashed" @click="showDeleteConfirm">Delete</pf-button>
    <pf-button type="dashed" @click="showPropsConfirm">With extra props</pf-button>
  </pf-space>
</template>
<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent } from 'vue';
import { PfModal } from '@pf-ui/pf-ui-vue';
export default defineComponent({
  setup() {
    const showConfirm = () => {
      PfModal.confirm({
        title: 'Do you Want to delete?',
        icon: createVNode(ExclamationCircleOutlined),
        closable: true,
        content: 'Some descriptions',
        okButtonProps: {
          type: 'primary',
          minWidth: '90px',
          size: 'small'
        },
        cancelButtonProps: {
          type: 'default',
          minWidth: '90px',
          size: 'small'
        },
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
        class: 'test',
      });
    };
    const showDeleteConfirm = () => {
      PfModal.confirm({
        title: 'Are you sure delete this task?',
        icon: createVNode(ExclamationCircleOutlined),
        closable: true,
        content: 'Some descriptions',
        okText: 'Yes',
        cancelText: 'No',
        okButtonProps: {
          type: 'secondary',
          minWidth: '90px',
          size: 'small'
        },
        cancelButtonProps: {
          type: 'secondary',
          minWidth: '90px',
          size: 'small'
        },
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
    const showPropsConfirm = () => {
      PfModal.confirm({
        title: 'Are you sure delete this task?',
        icon: createVNode(ExclamationCircleOutlined),
        closable: true,
        content: 'Some descriptions',
        okText: 'Yes',
        okButtonProps: {
          minWidth: '90px',
          size: 'small'
        },
        cancelText: 'No',
        cancelButtonProps: {
          type: 'default',
          minWidth: '90px',
          size: 'small'
        },
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    function showPromiseConfirm() {
      PfModal.confirm({
        title: 'Do you want to delete?',
        icon: createVNode(ExclamationCircleOutlined),
        closable: true,
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        okButtonProps: {
          type: 'secondary',
          minWidth: '90px',
          size: 'small'
        },
        cancelButtonProps: {
          type: 'secondary',
          minWidth: '90px',
          size: 'small'
        },
        async onOk() {
          try {
            return await new Promise((resolve, reject) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            });
          } catch {
            return console.log('Oops errors!');
          }
        },
        onCancel() {},
      });
    }
    return {
      showConfirm,
      showDeleteConfirm,
      showPropsConfirm,
      showPromiseConfirm,
    };
  },
});
</script>
