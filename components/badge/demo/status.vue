<docs>
---
order: 4
title: 
  zh-CN: 状态点
  en-US: Status
---

## zh-CN

用于表示状态的小圆点。

## en-US

Standalone badge with status.
</docs>

<template>
  <pf-badge status="success" />
  <pf-badge status="error" />
  <pf-badge status="default" />
  <pf-badge status=""  color="#4ACFB1" />
  <pf-badge status="processing" color="#FF9B54"/>
  <!-- <br />
  <pf-badge status="success" text="Success"/>
  <br />
  <pf-badge status="error" text="Error" />
  <br />
  <pf-badge status="default" text="Default" />
  <br />
  <pf-badge status="processing" text="Processing" />
  <br />
  <pf-badge status="warning" text="warning" /> -->

  <br />
  标准的颜色:
  <br />
  <pf-badge status="default" text="审批完成" color="#4ACFB1"/>
  <br />
  <pf-badge status="error" text="审批驳回" color="#F36969"/>
  <br />
  <pf-badge status="processing" text="审批中" color="#FF9B54"/>
  <br />
  <pf-badge status="" text="离职" color="#CCCCCC"/>
  <br />
  小提示标签:
  <br/>
  <pf-badge
    count="离"
    :number-style="{
      backgroundColor: '#cccccc',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
  <br/>
  <pf-badge
    count="在"
    :number-style="{
      backgroundColor: '#FF9B54',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
  <br />
  <pf-badge
    count="完"
    :number-style="{
      backgroundColor: '#4acfb1',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
  <br />
  <pf-badge
    count="驳"
    :number-style="{
      backgroundColor: '#f36969',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
  <br />
  <pf-badge
    count="测"
    :number-style="{
      backgroundColor: '#45a8e6',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
  <br />
  <pf-badge
    count="临"
    :number-style="{
      backgroundColor: '#a5b8d1',
      color: '#fff',
      border: 'none',
      padding: 0,
    }"
  />
</template>
