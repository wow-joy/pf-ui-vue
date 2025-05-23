import type {
  PropType,
  ExtractPropTypes,
  ComputedRef,
  Ref,
  ComponentPublicInstance,
  HTMLAttributes,
} from 'vue';
import {
  watch,
  defineComponent,
  computed,
  nextTick,
  ref,
  watchEffect,
  onBeforeUnmount,
  toRaw,
} from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import PropTypes from '../_util/vue-types';
import Row from '../grid/Row';
import type { ColProps } from '../grid/Col';
import { filterEmpty } from '../_util/props-util';
import { validateRules as validateRulesUtil } from './utils/validateUtil';
import { getNamePath } from './utils/valueUtil';
import { toArray } from './utils/typeUtil';
import { warning } from '../vc-util/warning';
import find from 'lodash-es/find';
import { tuple } from '../_util/type';
import type { InternalNamePath, Rule, RuleError, RuleObject, ValidateOptions, FormLabelAlign } from './interface';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useInjectForm } from './context';
import FormItemLabel from './FormItemLabel';
import FormItemInput from './FormItemInput';
import type { ValidationRule } from './Form';
import { useProvideFormItemContext } from './FormItemContext';
import useDebounce from './utils/useDebounce';

const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');
export type ValidateStatus = typeof ValidateStatuses[number];

export interface FieldExpose {
  fieldValue: Ref<any>;
  fieldId: ComputedRef<any>;
  fieldName: ComputedRef<any>;
  resetField: () => void;
  clearValidate: () => void;
  namePath: ComputedRef<InternalNamePath>;
  rules?: ComputedRef<ValidationRule[]>;
  validateRules: (options: ValidateOptions) => Promise<void> | Promise<RuleError[]>;
}

function getPropByPath(obj: any, namePathList: any, strict?: boolean) {
  let tempObj = obj;

  const keyArr = namePathList;
  let i = 0;
  try {
    for (let len = keyArr.length; i < len - 1; ++i) {
      if (!tempObj && !strict) break;
      const key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        if (strict) {
          throw Error('please transfer a valid name path to form item!');
        }
        break;
      }
    }
    if (strict && !tempObj) {
      throw Error('please transfer a valid name path to form item!');
    }
  } catch (error) {
    console.error('please transfer a valid name path to form item!');
  }

  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : undefined,
  };
}
export const formItemProps = () => ({
  htmlFor: String,
  prefixCls: String,
  label: PropTypes.any,
  help: PropTypes.any,
  extra: PropTypes.any,
  labelCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  wrapperCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  hasFeedback: { type: Boolean, default: false },
  colon: { type: Boolean, default: undefined },
  labelAlign: PropTypes.oneOf(tuple<[FormLabelAlign, FormLabelAlign]>('left', 'right')),
  prop: { type: [String, Number, Array] as PropType<string | number | Array<string | number>> },
  name: { type: [String, Number, Array] as PropType<string | number | Array<string | number>> },
  rules: [Array, Object] as PropType<Rule[] | Rule>,
  autoLink: { type: Boolean, default: true },
  required: { type: Boolean, default: undefined },
  validateFirst: { type: Boolean, default: undefined },
  validateStatus: PropTypes.oneOf(tuple('', 'success', 'warning', 'error', 'validating')),
  validateTrigger: { type: [String, Array] as PropType<string | string[]> },
  messageVariables: { type: Object as PropType<Record<string, string>> },
  hidden: Boolean,
  noStyle: Boolean,
  spaceBetween: { type: Boolean, default: false },
});

export type FormItemProps = Partial<ExtractPropTypes<ReturnType<typeof formItemProps>>>;

export type FormItemExpose = {
  onFieldBlur: () => void;
  onFieldChange: () => void;
  clearValidate: () => void;
  resetField: () => void;
};

export type FormItemInstance = ComponentPublicInstance<FormItemProps, FormItemExpose>;

let indexGuid = 0;

// default form item id prefix.
const defaultItemNamePrefixCls = 'form_item';

export default defineComponent({
  name: 'PfFormItem',
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: formItemProps(),
  slots: ['help', 'label', 'extra'],
  setup(props, { slots, attrs, expose }) {
    warning(props.prop === undefined, `\`prop\` is deprecated. Please use \`name\` instead.`);
    const eventKey = `form-item-${++indexGuid}`;
    const { prefixCls } = useConfigInject('form', props);
    const formContext = useInjectForm();
    const fieldName = computed(() => props.name || props.prop);
    const errors = ref([]);
    const validateDisabled = ref(false);
    const inputRef = ref();
    const namePath = computed(() => {
      const val = fieldName.value;
      return getNamePath(val);
    });
    const fieldId = computed(() => {
      if (!namePath.value.length) {
        return undefined;
      } else {
        const formName = formContext.name.value;
        const mergedId = namePath.value.join('_');
        return formName ? `${formName}_${mergedId}` : `${defaultItemNamePrefixCls}_${mergedId}`;
      }
    });
    const getNewFieldValue = () => {
      const model = formContext.model.value;
      if (!model || !fieldName.value) {
        return;
      } else {
        return getPropByPath(model, namePath.value, true).v;
      }
    };
    const fieldValue = computed(() => getNewFieldValue());

    const initialValue = ref(cloneDeep(fieldValue.value));
    const mergedValidateTrigger = computed(() => {
      let validateTrigger =
        props.validateTrigger !== undefined
          ? props.validateTrigger
          : formContext.validateTrigger.value;
      validateTrigger = validateTrigger === undefined ? 'change' : validateTrigger;
      return toArray(validateTrigger);
    });
    const rulesRef = computed<ValidationRule[]>(() => {
      let formRules = formContext.rules.value;
      const selfRules = props.rules;
      const requiredRule =
        props.required !== undefined
          ? { required: !!props.required, trigger: mergedValidateTrigger.value }
          : [];
      const prop = getPropByPath(formRules, namePath.value);
      formRules = formRules ? prop.o[prop.k] || prop.v : [];
      const rules = [].concat(selfRules || formRules || []);
      if (find(rules, rule => rule.required)) {
        return rules;
      } else {
        return rules.concat(requiredRule);
      }
    });
    const isRequired = computed(() => {
      const rules = rulesRef.value;
      let isRequired = false;
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired || props.required;
    });

    const validateState = ref();
    watchEffect(() => {
      validateState.value = props.validateStatus;
    });
    const messageVariables = computed(() => {
      let variables: Record<string, string> = {};
      if (typeof props.label === 'string') {
        variables.label = props.label;
      } else if (props.name) {
        variables.label = String(name);
      }
      if (props.messageVariables) {
        variables = { ...variables, ...props.messageVariables };
      }
      return variables;
    });
    const validateRules = (options: ValidateOptions) => {
      // no name, no value, so the validate result is incorrect
      if (namePath.value.length === 0) {
        return;
      }
      const { validateFirst = false } = props;
      const { triggerName } = options || {};

      let filteredRules = rulesRef.value;
      if (triggerName) {
        filteredRules = filteredRules.filter(rule => {
          const { trigger } = rule;
          if (!trigger && !mergedValidateTrigger.value.length) {
            return true;
          }
          const triggerList = toArray(trigger || mergedValidateTrigger.value);
          return triggerList.includes(triggerName);
        });
      }
      if (!filteredRules.length) {
        return Promise.resolve();
      }
      const promise = validateRulesUtil(
        namePath.value,
        fieldValue.value,
        filteredRules as RuleObject[],
        {
          validateMessages: formContext.validateMessages.value,
          ...options,
        },
        validateFirst,
        messageVariables.value,
      );
      validateState.value = 'validating';
      errors.value = [];

      promise
        .catch(e => e)
        .then((results: RuleError[] = []) => {
          if (validateState.value === 'validating') {
            const res = results.filter(result => result && result.errors.length);
            validateState.value = res.length ? 'error' : 'success';

            errors.value = res.map(r => r.errors);

            formContext.onValidate(
              fieldName.value,
              !errors.value.length,
              errors.value.length ? toRaw(errors.value[0]) : null,
            );
          }
        });

      return promise;
    };

    const onFieldBlur = () => {
      validateRules({ triggerName: 'blur' });
    };
    const onFieldChange = () => {
      if (validateDisabled.value) {
        validateDisabled.value = false;
        return;
      }
      validateRules({ triggerName: 'change' });
    };
    const clearValidate = () => {
      validateState.value = props.validateStatus;
      validateDisabled.value = false;
      errors.value = [];
    };

    const resetField = () => {
      validateState.value = props.validateStatus;
      validateDisabled.value = true;
      errors.value = [];
      const model = formContext.model.value || {};
      const value = fieldValue.value;
      const prop = getPropByPath(model, namePath.value, true);
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(initialValue.value);
      } else {
        prop.o[prop.k] = initialValue.value;
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
        validateDisabled.value = false;
      });
    };
    const htmlFor = computed(() => {
      return props.htmlFor === undefined ? fieldId.value : props.htmlFor;
    });
    const onLabelClick = () => {
      const id = htmlFor.value;
      if (!id || !inputRef.value) {
        return;
      }
      const control = inputRef.value.$el.querySelector(`[id="${id}"]`);
      if (control && control.focus) {
        control.focus();
      }
    };
    expose({
      onFieldBlur,
      onFieldChange,
      clearValidate,
      resetField,
    });

    useProvideFormItemContext(
      {
        id: fieldId,
        onFieldBlur: () => {
          if (props.autoLink) {
            onFieldBlur();
          }
        },
        onFieldChange: () => {
          if (props.autoLink) {
            onFieldChange();
          }
        },
        clearValidate,
      },
      computed(() => {
        return !!(props.autoLink && formContext.model.value && fieldName.value);
      }),
    );
    let registered = false;
    watch(
      fieldName,
      val => {
        if (val) {
          if (!registered) {
            registered = true;
            formContext.addField(eventKey, {
              fieldValue,
              fieldId,
              fieldName,
              resetField,
              clearValidate,
              namePath,
              validateRules,
              rules: rulesRef,
            });
          }
        } else {
          registered = false;
          formContext.removeField(eventKey);
        }
      },
      { immediate: true },
    );
    onBeforeUnmount(() => {
      formContext.removeField(eventKey);
    });
    const debounceErrors = useDebounce(errors);
    const mergedValidateStatus = computed(() => {
      if (props.validateStatus !== undefined) {
        return props.validateStatus;
      } else if (debounceErrors.value.length) {
        return 'error';
      }
      return validateState.value;
    });
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,

      // Status
      [`${prefixCls.value}-item-has-feedback`]: mergedValidateStatus.value && props.hasFeedback,
      [`${prefixCls.value}-item-has-success`]: mergedValidateStatus.value === 'success',
      [`${prefixCls.value}-item-has-warning`]: mergedValidateStatus.value === 'warning',
      [`${prefixCls.value}-item-has-error`]: mergedValidateStatus.value === 'error',
      [`${prefixCls.value}-item-is-validating`]: mergedValidateStatus.value === 'validating',
      [`${prefixCls.value}-item-hidden`]: props.hidden,
    }));
    return () => {
      if (props.noStyle) return slots.default?.();
      const help = props.help ?? (slots.help ? filterEmpty(slots.help()) : null);
      return (
        <Row
          {...attrs}
          class={[
            itemClassName.value,
            (help !== undefined && help !== null) || debounceErrors.value.length
              ? `${prefixCls.value}-item-with-help`
              : '',
            attrs.class,
          ]}
          key="row"
          v-slots={{
            default: () => (
              <>
                {/* Label */}
                <FormItemLabel
                  {...props}
                  htmlFor={htmlFor.value}
                  required={isRequired.value}
                  requiredMark={formContext.requiredMark.value}
                  prefixCls={prefixCls.value}
                  onClick={onLabelClick}
                  label={props.label ?? slots.label?.()}
                  spaceBetween={props.spaceBetween}
                />
                {/* Input Group */}
                <FormItemInput
                  {...props}
                  errors={
                    help !== undefined && help !== null ? toArray(help) : debounceErrors.value
                  }
                  prefixCls={prefixCls.value}
                  status={mergedValidateStatus.value}
                  ref={inputRef}
                  help={help}
                  extra={props.extra ?? slots.extra?.()}
                  v-slots={{ default: slots.default }}
                  // v-slots={{ default: () => [firstChildren, children.slice(1)] }}
                ></FormItemInput>
              </>
            ),
          }}
        ></Row>
      );
    };
  },
});
