import { defineComponent, ref, PropType, computed, watch, nextTick } from 'vue';
import { default as PfSelect, selectProps } from '../select';

import type { OptionProps } from '../vc-select/Option';
import { withInstall } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import InfoTwoTone from '@pf-ui/pf-icons-vue/InfoTwoTone';
import classNames from '../_util/classNames';

function toggleArrayItem(arr: any[], row: any, key: string) {
  const index = arr.findIndex((item: any) => item[key] === row[key]);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }

  return [...arr, row];
}

export interface TableDrop {
  label: string;
  title: string;
  width: number;
  render: any;
}
export const selectTableProps = () => ({
  value: Object as PropType<any>,
  ...selectProps,
  mode: String as PropType<'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'>,
  tableDrop: Array as PropType<TableDrop[]>,
  valueKey: String,
  labelKey: String,
  showSearch: Boolean,
  options: Array as PropType<OptionProps[]>,
});

const SelectTable = defineComponent({
  name: 'PfSelectTable',
  inheritAttrs: false,
  props: initDefaultProps(selectTableProps(), {
    valueKey: 'id',
    labelKey: 'name',
    showSearch: false,
  }),
  emits: ['change', 'search', 'update:value'],
  setup(props, { attrs, emit }) {
    const { prefixCls, direction, configProvider, size, getPrefixCls } = useConfigInject(
      'select-table',
      props,
    );
    const isMultiple = computed(() => {
      return props?.mode === 'multiple' || props?.mode === 'tags';
    });
    const value = ref<any | undefined>(
      isMultiple.value
        ? [...props.options.filter(x => props?.value?.includes(x[props.valueKey]))]
        : props.options.find(x => x[props.valueKey] === props?.value),
    );
    const searchValue = ref('');
    watch(
      () => props.value,
      v => {
        if (v === null || v === undefined) {
          value.value = isMultiple.value?[] :undefined;
          return;
        }
        if (isMultiple.value) {
          let valueArr = [...value.value].map((x: any) => x[props.valueKey]);
          if (valueArr.join() !== v.join()) {
            let newArr = [...v]?.filter((x: any) => !valueArr.includes(x));
            let arr = props.options.filter(x => newArr?.includes(x[props.valueKey]));
            let delArr = valueArr.filter((x: any) => !v.includes(x));
            value.value = [
              [...value.value].filter((x: any) => !delArr.includes(x[props.valueKey])),
              ...arr,
            ];
          }
        } else {
          if (v !== value.value?.[props?.valueKey]) {
            let obj = props.options.find(x => x[props.valueKey] === v);
            value.value = { ...obj };
          }
        }
      },
    );

    const open = ref(false);

    const handleSelectRowClick = (e: MouseEvent, row: any) => {
      if (isMultiple.value) {
        let toggleArr = toggleArrayItem([...(value.value || [])], row, props.valueKey);

        open.value = true;
        value.value = [...toggleArr];
        let valueArr = [...toggleArr].map((x: any) => x[props.valueKey]);
        emit?.(`update:value`, valueArr);
        emit('change', [...toggleArr]);
      } else {
        open.value = false;
        value.value = { ...row };

        emit('update:value', row[props.valueKey]);
        emit('change', { ...row });
      }
      nextTick(() => {
        searchValue.value = '';
      });
    };

    const handleMouseDouwn = (e: MouseEvent) => e.preventDefault();

    const elSelectSlots = {
      $stable: true,
      dropdownRender: () =>
        props?.tableDrop?.length ? (
          <div>
            {props.options.length > 0 ? (
              <div>
                <div class={`${prefixCls.value}-drop-header`}>
                  {props?.tableDrop.map((item: TableDrop) => (
                    <div
                      style={{ minWidth: `${item.width || 120}px` }}
                      class={`${prefixCls.value}-drop-header-item`}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
                <div class={`${prefixCls.value}-drop`}>
                  {props.options?.map((item: OptionProps, index: number) => (
                    <div
                      class={classNames(`${prefixCls.value}-drop-item`, {
                        [`${prefixCls.value}-drop-item-striped`]: index % 2 === 0,
                        [`${prefixCls.value}-drop-item-selected`]: isMultiple.value
                          ? value.value?.find(
                              (x: any) => x[props.valueKey] === item[props.valueKey],
                            )
                          : value.value?.[props.valueKey] === item[props.valueKey],
                      })}
                      onClick={(e: MouseEvent) => handleSelectRowClick(e, item)}
                      onMousedown={handleMouseDouwn}
                    >
                      {props.tableDrop.map((drop: TableDrop) => (
                        <div
                          class={classNames(`${prefixCls.value}-drop-label`, {})}
                          style={{ minWidth: `${drop.width || 120}px` }}
                          title={item[drop.label]}
                        >
                          {item[drop.label]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {props?.options.length === 0 ? (
              <div class={classNames(`${prefixCls.value}-drop-empty`)}>
                <InfoTwoTone class={classNames(`${prefixCls.value}-drop-empty-icon`)} />
                暂无数据
              </div>
            ) : null}
          </div>
        ) : (
          ''
        ),
    };

    const handleChange = (_value: any) => {
      if (!_value) {
        value.value = undefined;
        emit('change', undefined);
      }
    };
    const handleDeselect = (v: any) => {
      if (v) {
        let toggleArr = [...value.value].filter((x: any) => x[props.valueKey] !== v);
        value.value = [...toggleArr];
        let valueArr = [...value.value].map((x: any) => x[props.valueKey]);
        emit('change', [...toggleArr]);
        emit?.(
          `update:value`,
          valueArr.filter(x => x !== v),
        );
      }
    };
    const _handleDropdownVisibleChange = (_open: boolean) => {
      open.value = _open;
      if (!_open) {
        searchValue.value = '';
        emit('search', undefined);
      }
    };

    return () => (
      <>
        <PfSelect
          placeholder="请选择"
          {...attrs}
          mode={props.mode}
          open={open.value}
          searchValue={searchValue.value}
          showSearch={props.showSearch || false}
          onSearch={(value: string) => {
            searchValue.value = value;
            emit('search', value);
          }}
          onDropdownVisibleChange={_handleDropdownVisibleChange}
          defaultActiveFirstOption={false}
          onChange={handleChange}
          onDeselect={handleDeselect}
          v-slots={elSelectSlots}
          value={
            isMultiple.value
              ? value.value?.map((x: any) => x[props.labelKey])
              : value.value?.[props.labelKey]
          }
        />
      </>
    );
  },
});

export default withInstall(SelectTable);
