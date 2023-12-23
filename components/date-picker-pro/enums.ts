import CreateEnumMap from '../_util/createEnumMap'
import dayjs from 'dayjs'

const _getDay = (day: number) => day === 0 ? 6 : day - 1

// 时间日期组件数据
export enum DateDataEnum {
  OrgId = 'orgId', // 机构id
  Code = 'moduleCode', // 组件编码
  Name = 'name', // 组件名称
  Type = 'type', // 时间类型
  TypeName = 'type_name', // 时间类型名称
  Format = 'formate', // 时间格式
  FormatName = 'formate_name', // 时间格式名称
  Default = 'defaultVal', // 默认值
  DefaultName = 'defaultVal_name', // 时间默认值
  DefaultRangeName = 'defaultValRange_name', // 时间区间默认值
  TimeSpan = 'span', // 时间跨度
  TimeSpanName = 'span_name', // 时间跨度名称
  Remark = 'remark', // 备注
  CreateTime = 'createTime', // 创建时间
  UpdateTime = 'updateTime', // 更新时间
  HistoryId = 'hisUuid', // 历史版本id
  Creator = 'creator', // 创建人
  Updator = 'creatorName', // 更新人
}

// 路由类型
export enum RouteTypeEnum {
  Add = 'add', // 新增
  Edit = 'edit', // 编辑
  Copy = 'copy', // 复制
}

// 时间类型
export enum DateTypeEnum {
  Select = '2006-01', // 时间选择
  Span = '2006-02', // 时间区间
}

// 时间格式
export enum DateFormatEnum {
  A1 = '2007-01', // YYYY-MM-DD HH:mm:ss
  A2 = '2007-02', // YYYY-MM-DD HH:mm
  A3 = '2007-03', // YYYY-MM-DD HH
  A4 = '2007-04', // YYYY-MM-DD
  A5 = '2007-05', // YYYY-MM
  A6 = '2007-06', // YYYY
  B1 = '2007-07', // YYYY/MM/DD HH:mm:ss
  B2 = '2007-08', // YYYY/MM/DD HH:mm
  B3 = '2007-09', // YYYY/MM/DD HH
  B4 = '2007-10', // YYYY/MM/DD
  B5 = '2007-11', // YYYY/MM
  C1 = '2007-12', // YYYY年MM月DD日 HH:mm:ss
  C2 = '2007-13', // YYYY年MM月DD日 HH:mm
  C3 = '2007-14', // YYYY年MM月DD日 HH
  C4 = '2007-15', // YYYY年MM月DD日
  C5 = '2007-16', // YYYY年MM月
  C6 = '2007-17', // YYYY年
}

// 时间组件默认值
export enum DateDefaultEnum {
  Today = '2003-01', // 当天
  ThisMonth = '2003-02', // 当月
  MonthFirstDay = '2003-03', // 当月首天	
  ThisYear = '2003-04', // 当年	
  LastDay = '2003-05', // 前一天
  LastYear = '2003-06', // 前一年
  LastMonth = '2003-07', // 上个月
}

// 时间区间默认值
export enum DateSpanDefaultEnum {
  LastWeek = '2004-01', // 上一周
  ThisWeek = '2004-02', // 本周
  RecentWeek = '2004-03', // 近一周
  RecentMonth = '2004-04', // 近一月
  ThisMonth = '2004-05', // 本月
  LastMonth = '2004-06', // 上个月
  RecentQuarter = '2004-07', // 近三月
  RecentHalfYear = '2004-08', // 近半年
  RecentYear = '2004-09', // 近一年
  LastYear = '2004-10', // 近一年
}

// 时间区间跨度默认值
export enum DateSpanEnum {
  Month = '2005-01', // 一个月
  HalfYear = '2005-02', // 半年
  Year = '2005-03', // 一年
}

// 时间区间选择类型
export enum RangeTypeEnum {
  Cascade = '2025-01', // 级联选择
  Single = '2025-02', // 分开选择
}

export const MaxNameLength = 12

export const DateFormatMap = CreateEnumMap([
  {
    name: 'YYYY-MM-DD HH:mm:ss',
    id: DateFormatEnum.A1,
    picker: 'date',
    showTime: 'HH:mm:ss',
  },
  {
    name: 'YYYY-MM-DD HH:mm',
    id: DateFormatEnum.A2,
    picker: 'date',
    showTime: 'HH:mm'
  },
  {
    name: 'YYYY-MM-DD HH',
    id: DateFormatEnum.A3,
    picker: 'date',
    showTime: 'HH'
  },
  {
    name: 'YYYY-MM-DD',
    id: DateFormatEnum.A4,
    picker: 'date',
    showTime: false
  },
  {
    name: 'YYYY-MM',
    id: DateFormatEnum.A5,
    picker: 'month',
    showTime: false
  },
  {
    name: 'YYYY',
    id: DateFormatEnum.A6,
    picker: 'year',
    showTime: false
  },
  {
    name: 'YYYY/MM/DD HH:mm:ss',
    id: DateFormatEnum.B1,
    picker: 'date',
    showTime: 'HH:mm:ss'
  },
  {
    name: 'YYYY/MM/DD HH:mm',
    id: DateFormatEnum.B2,
    picker: 'date',
    showTime: 'HH:mm'
  },
  {
    name: 'YYYY/MM/DD HH',
    id: DateFormatEnum.B3,
    picker: 'date',
    showTime: 'HH'
  },
  {
    name: 'YYYY/MM/DD',
    id: DateFormatEnum.B4,
    picker: 'date',
    showTime: false
  },
  {
    name: 'YYYY',
    id: DateFormatEnum.B5,
    picker: 'month',
    showTime: false
  },
  {
    name: 'YYYY年MM月DD日 HH:mm:ss',
    id: DateFormatEnum.C1,
    picker: 'date',
    showTime: 'HH:mm:ss'
  },
  {
    name: 'YYYY年MM月DD日 HH:mm',
    id: DateFormatEnum.C2,
    picker: 'date',
    showTime: 'HH:mm'
  },
  {
    name: 'YYYY年MM月DD日 HH',
    id: DateFormatEnum.C3,
    picker: 'date',
    showTime: 'HH'
  },
  {
    name: 'YYYY年MM月DD日',
    id: DateFormatEnum.C4,
    picker: 'date',
    showTime: false
  },
  {
    name: 'YYYY年MM月',
    id: DateFormatEnum.C5,
    picker: 'month',
    showTime: false
  },
  {
    name: 'YYYY年',
    id: DateFormatEnum.C6,
    picker: 'year',
    showTime: false
  },
])

export const DateDefaultMap = CreateEnumMap([
  {
    id: DateDefaultEnum.Today,
    name: '当天',
    getDefaultValue: () => dayjs(),
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateDefaultEnum.ThisMonth,
    name: '当月',
    getDefaultValue: () => dayjs(),
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateDefaultEnum.MonthFirstDay,
    name: '当月首天',
    getDefaultValue: () => dayjs().startOf('month'),
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateDefaultEnum.ThisYear,
    name: '当年',
    getDefaultValue: () => dayjs(),
    notMatchedFormats: []
  },
  {
    id: DateDefaultEnum.LastDay,
    name: '前一天',
    getDefaultValue: () => dayjs().subtract(1, 'day'),
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateDefaultEnum.LastYear,
    name: '前一年',
    getDefaultValue: () => dayjs().subtract(1, 'year'),
    notMatchedFormats: []
  },
  {
    id: DateDefaultEnum.LastMonth,
    name: '上个月',
    getDefaultValue: () => dayjs().subtract(1, 'month'),
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
])

export const DateRangeDefaultMap = CreateEnumMap([
  {
    id: DateSpanDefaultEnum.LastWeek,
    name: '上一周',
    getDefaultValue: () => {
      const weekOfDay = _getDay(dayjs().day())
      
      const lastMonday = dayjs().subtract(weekOfDay + 7, 'days')
      const lastSunday = dayjs().subtract(weekOfDay + 1, 'days')
      console.log('lastMonday', lastMonday.format('YYYY-MM-DD'), weekOfDay)

      return [lastMonday, lastSunday]
    },
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.ThisWeek,
    name: '本周',
    getDefaultValue: () => {
      const weekOfDay = _getDay(dayjs().day())
      
      const monday = dayjs().subtract(weekOfDay, 'days')
      const sunday = dayjs().subtract(weekOfDay - 6, 'days')

      return [monday, sunday]
    },
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.RecentWeek,
    name: '近一周',
    getDefaultValue: () => {
      const first = dayjs().subtract(6, 'days')
      const last = dayjs()

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A5,
      DateFormatEnum.A6,
      DateFormatEnum.B5,
      DateFormatEnum.C5,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.RecentMonth,
    name: '近一月',
    getDefaultValue: () => {
      const first = dayjs().subtract(31 - 1, 'days')
      const last = dayjs()

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.ThisMonth,
    name: '本月',
    getDefaultValue: () => {
      const first = dayjs().startOf('month')
      const last = dayjs().endOf('month')

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.LastMonth,
    name: '上个月',
    getDefaultValue: () => {
      const first = dayjs().subtract(1, 'month').startOf('month')
      const last = dayjs().subtract(1, 'month').endOf('month')

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.RecentQuarter,
    name: '近三月',
    getDefaultValue: () => {
      const first = dayjs().subtract(31 * 3 - 1, 'days')
      const last = dayjs()

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.RecentHalfYear,
    name: '近半年',
    getDefaultValue: () => {
      const first = dayjs().subtract(364 / 2, 'days')
      const last = dayjs()

      return [first, last]
    },
    notMatchedFormats: [
      DateFormatEnum.A6,
      DateFormatEnum.C6
    ]
  },
  {
    id: DateSpanDefaultEnum.RecentYear,
    name: '近一年',
    getDefaultValue: () => {
      const first = dayjs().subtract(365 - 1, 'days')
      const last = dayjs()

      return [first, last]
    },
    notMatchedFormats: []
  },
  {
    id: DateSpanDefaultEnum.LastYear,
    name: '去年',
    getDefaultValue: () => {
      const first = dayjs().subtract(1, 'year').startOf('year')
      const last = dayjs().subtract(1, 'year').endOf('year')

      return [first, last]
    },
    notMatchedFormats: []
  },
])

// const handleGetDisabledDate = (span: number) => (current: Dayjs, data?: [Dayjs | undefined, Dayjs | undefined]) => {
//   const [start, end] = data || []
//   console.log('start', data, start?.format('YYYY-MM-DD'), current?.diff(start, 'days'), span)
//   const tooLate = start && current.diff(start, 'days') > span
//   const tooEarly = end && end.diff(current, 'days') > span
//   return tooEarly || tooLate
// }

export const DateSpanMap = CreateEnumMap([
  {
    id: DateSpanEnum.Month,
    name: '一个月',
    span: 31
    // getDisabledDate: handleGetDisabledDate(31)
  },
  {
    id: DateSpanEnum.HalfYear,
    name: '半年',
    span: 182
    // getDisabledDate: handleGetDisabledDate(182)
  },
  {
    id: DateSpanEnum.Year,
    name: '一年',
    span: 365
    // getDisabledDate: handleGetDisabledDate(365)
  },
])