import type { PropType } from 'vue'
import request from '../_util/request'
import { computed, defineComponent, ref, watch } from 'vue'
import { default as PfSelect, selectProps } from '../select'
import { default as PfTreeSelect, treeSelectProps, TreeSelectProps } from '../tree-select'
import omit from '../_util/omit'
import { withInstall } from '../_util/type'
import { pinyin } from 'pinyin-pro'

type RawValue = string | number

type SelectValue = RawValue | RawValue[] | undefined

export type ListItem = {
  label: string
  value: string | number
}

export type TreeItem = {
  label: string
  value: string | number
  children?: TreeItem[]
}

export type Config = {
  datas?: ListItem[] | TreeItem[]
  frameType: string
  name?: string
}

enum StructureTypeEnum {
  List = '2008-01', // 下拉列表
  Tree = '2008-02', // 下拉树
}

const getCofig = (params: {
  moduleCode: string
  hisUuid?: string
}) => request<Config>('/develop/module/sink/render.open', {
  params
})

const _selectProps = {
  ...omit(selectProps(), [
    'options'
  ]),
}

const _treeSelectProps = {
  ...omit(treeSelectProps(), [
    'treeData'
  ]),
}

export const selectProProps = () => ({
  ..._treeSelectProps,
  ..._selectProps,
  treeDefaultExpandAll: {
    type: Boolean,
    default: true
  },
  value: [Array, Object, String, Number] as PropType<SelectValue>,
  showSearch: {
    type: Boolean,
    default: true
  },
  defaultValue: [Array, Object, String, Number] as PropType<SelectValue>,
  code: String,
  hisUuid: String,
  domain: String,
  getConfig: Function as PropType<() => Promise<Config>>,
  surname: Boolean, // 姓氏模式 为 true 时按首字母搜索匹配到百家姓中的姓氏相关的字符时优先匹配姓氏拼音
  onConfigChange: Function as PropType<(config: Config) => void>,
  'onUpdate:config': Function as PropType<(config: Config) => void>,
})

const selectSlots = [
  'notFoundContent',
  'suffixIcon',
  'itemIcon',
  'removeIcon',
  'clearIcon',
  'dropdownRender',
  'option',
  'placeholder',
  'tagRender',
  'maxTagPlaceholder',
  'optionLabel', // donot use, maybe remove it
]

const treeSelectSlots = [
  'title',
  'titleRender',
  'placeholder',
  'maxTagPlaceholder',
  'treeIcon',
  'switcherIcon',
  'notFoundContent',
]

const SelectPro = defineComponent({
  name: 'PfSelectPro',
  inheritAttrs: false,
  props: selectProProps(),
  slots: [...new Set(...selectSlots, ...treeSelectSlots)],
  setup(props, { attrs, slots, emit }) {
    const configLoading = ref(false)
    const config = ref<Config>()

    const selectMergedProps = computed(() => {
      let res = {}
      Object.keys(_selectProps).forEach(key => {
        if (props.hasOwnProperty(key) && props[key] !== undefined) {
          res[key] = props[key]
        }
      })
      return res
    })

    const treeSelectMergedProps = computed(() => {
      let res = {}
      Object.keys(_treeSelectProps).forEach(key => {
        if (props.hasOwnProperty(key) && props[key] !== undefined) {
          res[key] = props[key]
        }
      })
      return res
    })

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
        config.value = res
        props.onConfigChange?.(res)
        emit('update:config', res)
      }).finally(() => {
        configLoading.value = false
      })
    }, {
      immediate: true
    })

    const filterInput = (inputValue: string, label?: string) => {
      if (label?.includes(inputValue)) {
        return true
      } else {
        const zhInitials = pinyin(label, {
          pattern: 'first',
          toneType: 'none',
          separator: '',
          removeNonZh: true,
          mode: props.surname ? 'surname' : 'normal'
        })
        return zhInitials?.includes(inputValue)
      }
    }

    const filterSelect = (inputValue: string, option?: ListItem) => {
      if (inputValue) {
        const { label } = option || {}
        return filterInput(inputValue, label)
      } else {
        return true
      }
    }

    const renderSelect = () => (
      <PfSelect
        placeholder="请选择"
        filterOption={filterSelect}
        {...attrs}
        {...selectMergedProps.value}
        options={config.value?.datas}
        v-slots={{ ...slots }}
      />
    )

    const filterTreeSelect: TreeSelectProps['filterTreeNode'] = (inputValue, node) => {
      if (inputValue) {
        const { label } = node || {}
        return filterInput(inputValue, label)
      } else {
        return true
      }
    }

    const renderTreeSelect = () => (
      <PfTreeSelect
        placeholder="请选择"
        filterTreeNode={filterTreeSelect}
        {...attrs}
        {...treeSelectMergedProps.value}
        treeData={config.value?.datas}
        v-slots={{ ...slots }}
      />
    )

    return () => {
      if (config.value?.frameType === StructureTypeEnum.List) {
        return renderSelect()
      } else if (config.value?.frameType === StructureTypeEnum.Tree) {
        return renderTreeSelect()
      } else {
        return null
      }
    }
  }
})

export default withInstall(SelectPro)