<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
---

## zh-CN

表单 label 文字分散显示

pf-form-item 配置属性 `spaceBetween` (特殊要求可以使用使用 slot 定制 label)

## en-US

Basic Form data control. Includes layout, initial values, validation and submit.
</docs>
<template>
  <pf-form
    :model="formState"
    name="basic"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <pf-form-item
      label="姓名"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <pf-input v-model:value="formState.username" />
    </pf-form-item>
    <pf-form-item
      label="姓名"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
      spaceBetween
    >
      <pf-input v-model:value="formState.username" />
    </pf-form-item>
    <pf-form-item
      label="姓名"
      name="username"
      spaceBetween
    >
      <pf-input v-model:value="formState.username" />
    </pf-form-item>

    <pf-form-item
      label="出生日期"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      spaceBetween
    >
      <pf-input-password v-model:value="formState.password" />
    </pf-form-item>

    <pf-form-item
      label="三个字"
      name="three"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      spaceBetween
    >
      <pf-input-password v-model:value="formState.three" />
    </pf-form-item>

    <pf-form-item
      label="三个字"
      name="three"
      spaceBetween
    >
      <pf-input-password v-model:value="formState.three" />
    </pf-form-item>


    <pf-form-item name="remember" :wrapper-col="{ offset: 4, span: 16 }">
      <pf-checkbox v-model:checked="formState.remember">Remember me</pf-checkbox>
    </pf-form-item>

    <pf-form-item :wrapper-col="{ offset: 4, span: 16 }" style="margin-top: 24px;">
      <pf-button type="primary" html-type="submit">Submit</pf-button>
    </pf-form-item>
  </pf-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
  three: string;
  remember: boolean;
}
export default defineComponent({
  setup() {
    const formState = reactive<FormState>({
      username: '',
      password: '',
      three: '',
      remember: true,
    });
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>
