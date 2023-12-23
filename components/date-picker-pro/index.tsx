import type { PropType } from 'vue'
import request from '../_util/request'
import { computed, defineComponent, ref, watch } from 'vue'
import DatePicker, { RangePicker } from '../date-picker'
import { commonProps, rangePickerProps, datePickerProps, RangePickerProps, CommonProps } from '../date-picker/generatePicker/props'
import type {
  RangeValue,
  DisabledTime,
  DisabledTimes,
  EventValue,
  PanelMode,
  PickerMode
} from '../vc-picker/interface'
import {
  RangeType
} from '../vc-picker/RangePicker'
import type { VueNode } from '../_util/type'
import { DateFormatMap, DateSpanMap, DateTypeEnum, DateDefaultMap, DateRangeDefaultMap, RangeTypeEnum } from './enums'
import { withInstall } from '../_util/type'
import { Dayjs } from 'dayjs'
import classNames from '../_util/classNames'
import useConfigInject from '../_util/hooks/useConfigInject'

type ValueType<T> = T | string | RangeValue<T> | RangeValue<string>

export type Config = {
  name: string // 组件名称
  type: string // 组件类型
  formate: string // 时间格式
  span?: string // 时间跨度
  defaultVal?: string // 默认值
  choice?: string // 区间选择类型
}

const rangeSinglePickerProps = () => ({
  pickerClassName: String, // 分开选择的区间选择单个选择器样式
})

const _commonProps = commonProps()
const _datePickerProps = datePickerProps()
const _rangePickerProps = rangePickerProps()
const _rangeSinglePickerProps = rangeSinglePickerProps()

function datePickerProProps<DateType = any>() {
  return {
    ..._commonProps,
    ..._datePickerProps,
    ..._rangePickerProps,
    ..._rangeSinglePickerProps,
    defaultPickerValue: {
      type: Array as unknown as PropType<ValueType<DateType>>
    },
    defaultValue: {
      type: Array as unknown as PropType<ValueType<DateType>>
    },
    value: {
      type: Array as unknown as PropType<ValueType<DateType>>
    },
    disabledTime: {
      type: [Function, Function] as PropType<DisabledTime<DateType> & ((date: EventValue<DateType>, type: RangeType) => DisabledTimes)>
    },
    format: _datePickerProps.format,
    renderExtraFooter: {
      type: [Function, Function] as PropType<((mode: PanelMode) => VueNode) & (() => VueNode)>
    },
    onChange: {
      type: [Function, Function] as PropType<
        ((value: DateType | string | null, dateString: string) => void) &
        ((
          value: RangeValue<DateType> | RangeValue<string> | null,
          dateString: [string, string],
        ) => void)
      >
    },
    'onUpdate:value': {
      type: [Function, Function] as PropType<((value: DateType | string | null) => void) & ((value: RangeValue<DateType> | RangeValue<string> | null) => void)>
    },
    onOk: {
      type: [Function, Function] as PropType<((value: DateType | string | null) => void) & ((dates: RangeValue<DateType> | RangeValue<string>) => void)>
    },
    code: String,
    hisUuid: String,
    domain: String,
    getConfig: Function as PropType<(() => Promise<Config>) | (() => Promise<undefined>)>,
    onConfigChange: Function as PropType<(config: Config) => void>,
    'onUpdate:config': Function as PropType<(config: Config) => void>,
  }
}

const getCofig = (params: {
  moduleCode: string
  hisUuid?: string
}) => request<Config>('/develop/module/time/render.open', {
  params
})

const mergeProps = (originProps: any, props: any) => {
  let res = {}
  Object.keys(originProps).forEach(key => {
    if (props.hasOwnProperty(key) && props[key] !== undefined) {
      res[key] = props[key]
    }
  })
  return res as any
}

const DatePickerPro = defineComponent({
  name: 'PfDatePickerPro',
  inheritAttrs: false,
  props: datePickerProProps(),
  slots: [
    'suffixIcon',
    'prevIcon',
    'nextIcon',
    'superPrevIcon',
    'superNextIcon',
    'dateRender',
    'renderExtraFooter',
    'monthCellRender',
  ],
  setup(props, { attrs, slots, emit }) {
    const { prefixCls } = useConfigInject(
      'picker',
      props,
    )

    const configLoading = ref(false)
    const config = ref<Config & {
      picker?: PickerMode,
      showTime?: string | boolean,
      format?: string
    }>()

    const cacheDates = ref<[Dayjs, Dayjs]>()
    const rangeValue = ref<RangeValue<Dayjs> | RangeValue<string>>()
    const hackValue = ref<[Dayjs, Dayjs]>()

    const defaultValueCache = ref<Dayjs | string | [Dayjs, Dayjs] | [string, string]>()

    watch([
      () => props.code,
      () => props.hisUuid,
      () => props.domain,
      () => props.getConfig
    ], ([curCode, curHisUuid, curDomain, curGetConfig], [preCode, preHisUuid, preDomain]) => {
      let configPromise: Promise<Config>
      if ((curCode && curCode !== preCode) || (curHisUuid && curHisUuid !== preHisUuid) || ((curCode || curHisUuid) && curDomain !== preDomain)) {
        configLoading.value = true
        configPromise = getCofig({
          moduleCode: curCode || '',
          hisUuid: curHisUuid && !curCode ? curHisUuid : ''
        })
      } else if (curGetConfig) {
        configPromise = curGetConfig()
      }
      configPromise?.then(res => {
        const formatData = DateFormatMap.findById(res?.formate)
        const _config = {
          ...res,
          picker: formatData?.picker,
          showTime: formatData?.showTime,
          format: formatData?.name
        }
        console.log('_config', _config)
        config.value = _config
        props.onConfigChange?.(_config)
        emit('update:config', _config)

        if (res.defaultVal) {
          if (res.type === DateTypeEnum.Select) {
            const defaultData = DateDefaultMap.findById(config.value?.defaultVal)
            const defaultValue: Dayjs | undefined = defaultData && defaultData.getDefaultValue && defaultData.getDefaultValue()
            defaultValueCache.value = defaultValue
            props.onChange?.(defaultValue, defaultValue?.format(formatData?.name))
            emit('update:value', defaultValue)
          } else if (res.type === DateTypeEnum.Span) {
            const defaultData = DateRangeDefaultMap.findById(config.value?.defaultVal)
            const defaultValue: [Dayjs | undefined, Dayjs | undefined] | undefined = defaultData && defaultData.getDefaultValue && defaultData.getDefaultValue()
            const valueString = defaultValue?.map(v => v?.format(formatData?.name)) as [string, string]
            rangeValue.value = defaultValue
            props.onChange?.(defaultValue, valueString)
            emit('update:value', defaultValue)
          }
        }
      }).finally(() => {
        configLoading.value = false
      })
    }, {
      immediate: true
    })

    const rangeMergedProps = computed(() => mergeProps({
      ..._commonProps,
      ..._rangePickerProps
    }, props))

    const rangeSingleMergedProps = computed(() => {
      const merged = mergeProps({
        ..._commonProps,
        ..._datePickerProps,
        ..._rangeSinglePickerProps
      }, props)

      return {
        ...merged,
        'onUpdate:value': undefined,
        defaultValue: undefined
      }
    })
    const rangeSingleMergedPickerClass = computed(() => classNames(`${prefixCls.value}-pro-range-single-picker`, props.pickerClassName))

    watch(
      [
        () => props.value,
        () => rangeMergedProps.value?.defaultValue
      ],
      ([curValue, curDefaultValue]) => {
        if (config.value?.type === DateTypeEnum.Span) {
          rangeValue.value = curValue || curDefaultValue
        }
      }
    )

    const dateMergedProps = computed(() => mergeProps({
      ..._commonProps,
      ..._datePickerProps,
    }, props))

    const renderDatePicker = () => (
      <DatePicker
        placeholder="请选择"
        defaultValue={defaultValueCache.value}
        {...attrs}
        {...dateMergedProps.value}
        picker={config.value?.picker}
        showTime={config.value?.showTime && { format: config.value.showTime }}
        format={config.value?.format}
        v-slots={{ ...slots }} 
      />
    )

    const handleRangeDisabledDate = (current: Dayjs) => {
      if (!cacheDates.value || (cacheDates.value as any).length === 0) {
        return false
      }
      const span = DateSpanMap.findById(config.value?.span)?.span
      const [start, end] = cacheDates.value
      const tooLate = start && current.diff(start, 'days') > span
      const tooEarly = end && end.diff(current, 'days') > span
      
      return tooEarly || tooLate
    }

    const handleRangeOpenChange = (open: boolean) => {
      if (open) {
        cacheDates.value = [] as any
        hackValue.value = [] as any
      } else {
        hackValue.value = undefined
      }
      rangeMergedProps.value?.onOpenChange?.(open)
    }

    const handleRangeChange: RangePickerProps<Dayjs>['onChange'] = (value, dateString) => {
      rangeValue.value = value
      rangeMergedProps.value?.onChange?.(value, dateString)
    }

    const handleRangeCalendarChange: RangePickerProps<Dayjs>['onCalendarChange'] = (value, formatString, info) => {
      cacheDates.value = value as [Dayjs, Dayjs]
      rangeMergedProps.value?.onCalendarChange?.(value, formatString, info)
    }

    const renderRangePicker = () => (
      <RangePicker
        {...attrs}
        {...rangeMergedProps.value}
        picker={config.value?.picker}
        showTime={config.value?.showTime && { format: config.value.showTime }}
        format={config.value?.format}
        disabledDate={handleRangeDisabledDate}
        onChange={handleRangeChange}
        onOpenChange={handleRangeOpenChange}
        onCalendarChange={handleRangeCalendarChange}
        value={hackValue.value || props.value || rangeValue.value}
        v-slots={{ ...slots }}
      />
    )

    const handleRangeSingleStartChange: CommonProps<Dayjs>['onChange'] = (value) => {
      const range = [value || undefined, rangeValue.value?.[1]] as [Dayjs, Dayjs]
      const dateString = range.map(v => v?.format(config.value?.format)) as [string, string]
      rangeValue.value = range
      rangeSingleMergedProps.value.onChange?.(range, dateString)
      emit('update:value', range)
    }

    const handleRangeSingleEndChange: CommonProps<Dayjs>['onChange'] = (value) => {
      const range = [rangeValue.value?.[0], value || undefined] as [Dayjs, Dayjs]
      const dateString = range.map(v => v?.format(config.value?.format)) as [string, string]
      rangeValue.value = range
      rangeSingleMergedProps.value.onChange?.(range, dateString)
      emit('update:value', range)
    }

    const handleRangeSingleStartDisabledDate = (current: Dayjs) => {
      const end = rangeValue.value?.[1] as Dayjs
      if (!end || typeof end !== 'object') {
        return false
      }
      const span = DateSpanMap.findById(config.value?.span)?.span
      const tooLate = current.isAfter(end)
      const tooEarly = end.diff(current, 'days') > span

      return tooEarly || tooLate
    }

    const handleRangeSingleEndDisabledDate = (current: Dayjs) => {
      const start = rangeValue.value?.[0] as Dayjs
      if (!start || typeof start !== 'object') {
        return false
      }
      const span = DateSpanMap.findById(config.value?.span)?.span
      const tooLate = current.diff(start, 'days') > span
      const tooEarly = current.isBefore(start)

      return tooEarly || tooLate
    }

    const renderRangeSinglePicker = () => (
      <div
        {...attrs}
        class={classNames(`${prefixCls.value}-pro-range-single`, attrs.class)}
      >
        <DatePicker
          placeholder="请选择"
          {...rangeSingleMergedProps.value}
          value={rangeValue.value?.[0]}
          // defaultValue={rangeSingleMergedProps.value?.defaultValue?.[0]}
          onChange={handleRangeSingleStartChange}
          picker={config.value?.picker}
          showTime={config.value?.showTime && { format: config.value.showTime }}
          format={config.value?.format}
          disabledDate={handleRangeSingleStartDisabledDate}
          class={rangeSingleMergedPickerClass.value}
          v-slots={{ ...slots }}
        />
        <div class={`${prefixCls.value}-pro-range-single-divider`} />
        <DatePicker
          placeholder="请选择"
          {...rangeSingleMergedProps.value}
          value={rangeValue.value?.[1]}
          // defaultValue={rangeSingleMergedProps.value?.defaultValue?.[1]}
          onChange={handleRangeSingleEndChange}
          picker={config.value?.picker}
          showTime={config.value?.showTime && { format: config.value.showTime }}
          format={config.value?.format}
          disabledDate={handleRangeSingleEndDisabledDate}
          class={rangeSingleMergedPickerClass.value}
          v-slots={{ ...slots }} 
        />
      </div>
    )

    return () => {
      if (config.value?.type === DateTypeEnum.Select) {
        return renderDatePicker()
      } else if (config.value?.type === DateTypeEnum.Span) {
        return config.value?.choice === RangeTypeEnum.Single ? renderRangeSinglePicker() : renderRangePicker()
      } else {
        return null
      }
    }
  }
})

export default withInstall(DatePickerPro)