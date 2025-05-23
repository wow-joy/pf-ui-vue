---
category: Components
subtitle: 表单
type: 数据录入
cols: 1
title: Form
cover: https://gw.alipayobjects.com/zos/alicdn/ORmcdeaoO/Form.svg
---

高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。

## 何时使用

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

## 表单

我们为 `form` 提供了以下三种排列方式：

- 水平排列：标签和表单控件水平排列；（默认）
- 垂直排列：标签和表单控件上下垂直排列；
- 行内排列：表单项水平行内排列。

## 表单域

表单一定会包含表单域，表单域可以是输入控件，标准表单域，标签，下拉菜单，文本域等。

## API

### Form

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| colon | 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效) | boolean | false |  |
| hideRequiredMark | 隐藏所有表单项的必选标记 | Boolean | false |  |
| labelAlign | label 标签的文本对齐方式 | 'left' \| 'right' | 'right' |  |
| labelCol | label 标签布局，同 `<Col>` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | [object](/components/grid-cn/#Col) |  |  |
| labelWrap | label 标签的文本换行方式 | boolean | false |  |
| layout | 表单布局 | 'horizontal'\|'vertical'\|'inline' | 'horizontal' |  |
| model | 表单数据对象 | object |  |  |
| name | 表单名称，会作为表单字段 `id` 前缀使用 | string | - |  |
| noStyle | 为 `true` 时不带样式，作为纯字段控件使用 | boolean | false |  |
| rules | 表单验证规则 | object |  |  |
| scrollToFirstError | 提交失败自动滚动到第一个错误字段 | boolean \| [options](https://github.com/stipsan/scroll-into-view-if-needed/#options) | false |  |
| validateOnRuleChange | 是否在 rules 属性改变后立即触发一次验证 | boolean | true |  |
| validateTrigger | 统一设置字段校验规则 | string \| string\[] | `change` |  |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | [object](/components/grid-cn/#Col) |  |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |  |
| --- | --- | --- | --- | --- |
| finish | 提交表单且数据验证成功后回调事件 | function(values) | - |  |
| finishFailed | 提交表单且数据验证失败后回调事件 | function({ values, errorFields, outOfDate }) | - |  |
| submit | 数据验证成功后回调事件 | Function(e:Event) | ｜ |  |
| validate | 任一表单项被校验后触发 | Function(name, status, errorMsgs) |  |  |

### 方法

| 方法名 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 name 属性或者 name 组成的数组，如不传则移除整个表单的校验结果 | (nameList?: [NamePath](#NamePath)\[]) => void |  |
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | (nameList?: [NamePath](#NamePath)\[]) => void |  |
| scrollToField | 滚动到对应字段位置 | (name: [NamePath](#NamePath), options: \[[ScrollOptions](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options)]) => void |  |
| validate | 触发表单验证, 同 validateFields | (nameList?: [NamePath](#NamePath)\[]) => Promise |  |
| validateFields | 触发表单验证 | (nameList?: [NamePath](#NamePath)\[]) => Promise |  |

#### NamePath

`string | number | (string | number)[]`

### Form.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoLink | 是否自动关联表单域，对于大部分情况都可以使用自动关联，如果不满足自动关联的条件，可以手动关联，参见下方注意事项 | boolean | true |  |
| colon | 配合 label 属性使用，表示是否显示 label 后面的冒号 | boolean | true |  |
| extra | 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 | string\|slot |  |  |
| hasFeedback | 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用 | boolean | false |  |
| help | 提示信息，如不设置，则会根据校验规则自动生成 | string\|slot |  |  |
| htmlFor | 设置子元素 label `htmlFor` 属性 | string |  |  |
| label | label 标签的文本 | string\|slot |  |  |
| labelAlign | 标签文本对齐方式 | 'left' \| 'right' | 'right' |  |
| labelCol | label 标签布局，同 `<Col>` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | [object](/components/grid-cn/#Col) |  |  |
| name | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string |  |  |
| required | 是否必填，如不设置，则会根据校验规则自动生成 | boolean | false |  |
| rules | 表单验证规则 | object \| array |  |  |
| validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验。 | boolean | false |  |
| validateStatus | 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating' | string |  |  |
| validateTrigger | 设置字段校验的时机 | string \| string\[] | `change` |  |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | [object](/components/grid-cn/#Col) |  |  |
| spaceBetween | label 文字分散显示 | boolean | false | 1.0.58 以上 |

### 注意：

#### 3.x

自  版本以后，Form.Item 不再劫持子元素，而是通过 provider / inject 依赖注入的方式进行自动校验，这种方式可以提高组件性能，子元素也不会限制个数，同样子元素也可以是进一步封装的高级组件。你可以参考[自定义表单控件示例](#components-form-demo-customized-form-controls)

但它同样会有一些缺点：

1、自定义组件如果希望 Form.Item 进行校验展示，你需要 `const {id, onFieldChange, onFieldBlur} = useInjectFormItemContext()` 注入，并调用相应的方法。

2、一个 Form.Item 只能收集一个表单项的数据，如果有多个表单项，会导致收集错乱，例如，

```html
<pf-form-item>
  <pf-input name="a"></pf-input>
  <pf-input name="b"></pf-input>
</pf-form-item>
```

如上 Form.Item 并不知道需要收集 `name="a"` 还是 `name=`b\`\`，你可以通过如下三种方式去解决此类问题：

第一种，使用多个 `pf-form-item`:

```html
<pf-form-item>
  <pf-input name="a"></pf-input>
  <pf-form-item><pf-input name="b"></pf-input></pf-form-item>
</pf-form-item>
```

第二种，使用自定义组件包裹，并在自定义组件中调用 `useInjectFormItemContext`，相当于把多个表单项合并成了一个

```html
<script>
  // 自定义组件
  import { PfForm } from '@pf-ui/pf-ui-vue';
  export default {
    setup() {
      const formItemContext = PfForm.useInjectFormItemContext();
    },
  };
</script>
```

```html
<pf-form-item>
  <custom-com>
    <pf-input name="a"></pf-input>
    <pf-input name="b"></pf-input>
  </custom-com>
</pf-form-item>
```

第三种，组件库提供了一个 `pf-form-item-rest` 组件，它会阻止数据的收集，你可以将不需要收集校验的表单项放到这个组件中即可，它和第一种方式很类似，但它不会产生额外的 dom 节点。

```html
<pf-form-item>
  <pf-input name="a"></pf-input>
  <pf-form-item-rest><pf-input name="b"></pf-input></pf-form-item-rest>
</pf-form-item>
```

#### 2.x

Form.Item 会对唯一子元素进行劫持，并监听 `blur` 和 `change` 事件，来达到自动校验的目的，所以请确保表单域没有其它元素包裹。如果有多个子元素，将只会监听第一个子元素的变化。

如果要监听的表单域不满足自动监听的条件，可以通过如下方式关联表单域：

```html
<pf-form-item name="form.name" ref="name" :autoLink="false">
  <pf-input v-model:value="other" />
  <span>hahha</span>
  <div>
    <pf-input
      v-model:value="form.name"
      @blur="() => {$refs.name.onFieldBlur()}"
      @change="() => {$refs.name.onFieldChange()}"
    />
  </div>
</pf-form-item>
```

### 校验规则

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| enum | 枚举类型 | string | - |
| len | 字段长度 | number | - |
| max | 最大长度 | number | - |
| message | 校验文案 | string | - |
| min | 最小长度 | number | - |
| pattern | 正则表达式校验 | RegExp | - |
| required | 是否必选 | boolean | `false` |
| transform | 校验前转换字段值 | function(value) => transformedValue:any | - |
| trigger | 校验触发的时机 | 'blur' \| 'change' \| `['change', 'blur']` | - |
| type | 内建校验类型，[可选项](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | 自定义校验（注意，[callback 必须被调用](https://github.com/ant-design/ant-design/issues/5155)） | function(rule, value, callback) | - |
| whitespace | 必选时，空格是否会被视为错误 | boolean | `false` |

更多高级用法可研究 [async-validator](https://github.com/yiminghe/async-validator)。

### useForm

`useForm` 是一个可以独立 `Form` 组件运行的方法，它使用 Vue 响应式机制进行数据的监听和校验，并将校验结果返回，你可以将校验结果绑定到任何组件上，`Form.Item` 也仅仅是将结果展示。


为保持`useForm`独立于 `Form` 组件，请将`useForm`返回值中的`validateInfos`绑定在`FormItem`组件上，并且不要将`FormItem`组件的`autoLink`配置为`true`。


使用`useForm`时，`Form`及`FormItem`组件与数据逻辑、校验相关的属性会失效，如`validateFirst`，`validateTrigger`。`validateFirst`需要在`useForm`的`options`中配置`validateFirstName`或者在调用`validate`、`validateField`时传入`validateFirst`，`validate`、`validateField`中的`validateFirst`优先级大于`validateFirstName`。使用`blur`作为trigger时需在控件上绑定方法触发校验，参考[`useForm 自定义触发时机`](#components-form-demo-useForm-trigger)

```ts
import { PfForm } from '@pf-ui/pf-ui-vue';
const useForm = PfForm.useForm;

useForm(modelRef, ruleRef, [options]);
```

参数说明：

```ts
/*
 modelRef`, `ruleRef` 必须是响应式数据
*/

interface Props {
  [key: string]: any;
}
interface ValidateInfo {
  autoLink?: boolean;
  required?: boolean;
  validateStatus?: "" | "success" | "warning" | "error" | "validating";
  help?: any;
}
interface validateOptions {
  validateFirst?: boolean;
  validateMessages?: ValidateMessages;
  trigger?: 'change' | 'blur' | string | string[];
}
interface ValidateInfo {
  autoLink?: boolean;
  required?: boolean;
  validateStatus?: ValidateStatus;
  help?: any;
}
function useForm(
  modelRef: Props | Ref<Props>,
  rulesRef: Props | Ref<Props> = ref({}),
  options?: {
    immediate?: boolean;
    deep?: boolean;
    validateOnRuleChange?: boolean;
    debounce?: {
      leading?: boolean;
      wait?: number;
      trailing?: boolean;
    };
    onValidate?: (
      name: string | number | string[] | number[],
      status: boolean,
      errors: string[] | null,
    ) => void;
    validateFirstName?: string | string[] | boolean
  },
): {
  modelRef: Props | Ref<Props>;
  rulesRef: Props | Ref<Props>;
  initialModel: Props;
  validateInfos: {
    [key: string]: ValidateInfo;
  };
  resetFields: (newValues?: Props) => void;
  validate: <T = any>(names?: string | string[], option?: validateOptions) => Promise<T>;
  validateField:( 
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option?: validateOptions,
  ) => Promise<RuleError[]>;
  mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  clearValidate: (names?: namesType) => void;
};
```
