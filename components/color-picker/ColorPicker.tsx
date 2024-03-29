import type { CSSProperties, ComputedRef, ExtractPropTypes, PropType } from 'vue';
import type { HsbaColorType } from '../vc-color-picker';
import type { PopoverProps } from '../popover';
import type { Color } from './color';
import type { PanelRender } from './ColorPickerPanel';

import { computed, defineComponent, shallowRef } from 'vue';

// import useConfigInject from '../config-provider/hooks/useConfigInject';
import useConfigInject from '../_util/hooks/useConfigInject';
import Popover from '../popover';
import { generateColor } from './util';
import PropTypes from '../_util/vue-types';
import useMergedState from '../_util/hooks/useMergedState';
import classNames from '../_util/classNames';
import ColorPickerPanel from './ColorPickerPanel';

import ColorTrigger from './components/ColorTrigger';
import useColorState from './hooks/useColorState';

import type {
  ColorFormat,
  ColorPickerBaseProps,
  PresetsItem,
  TriggerPlacement,
  TriggerType,
} from './interface';
import type { VueNode } from '../_util/type';

const DefaultColor = '#ffffff';
const colorPickerProps = () => ({
  value: {
    type: [String, Object] as PropType<string | Color>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Object] as PropType<string | Color>,
    default: DefaultColor,
  },
  open: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  placement: {
    type: String as PropType<TriggerPlacement>,
    default: 'bottomLeft',
  },
  trigger: {
    type: String as PropType<TriggerType>,
    default: 'click',
  },
  format: {
    type: String as PropType<'hex' | 'hsb' | 'rgb'>,
    default: 'hex',
  },
  formatOptions: {
    type: Array as PropType<('hex' | 'hsb' | 'rgb')[]>,
    default: undefined
  },
  allowClear: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  presets: {
    type: Array as PropType<PresetsItem[]>,
    default: undefined,
  },
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter: boolean }>,
    default: true,
  },
  styles: {
    type: Object as PropType<{ popup?: CSSProperties; popupOverlayInner?: StyleSheet }>,
    default: () => ({}),
  },
  rootClassName: PropTypes.string,
  onOpenChange: {
    type: Function as PropType<(open: boolean) => void>,
    default: () => {},
  },
  onFormatChange: {
    type: Function as PropType<(format: ColorFormat) => void>,
    default: () => {},
  },
  onChange: {
    type: Function as PropType<(value: Color, hex: string) => void>,
    default: () => {},
  },
  getPopupContainer: {
    type: Function as PropType<PopoverProps['getPopupContainer']>,
    default: undefined,
  },
  autoAdjustOverflow: {
    type: Boolean as PropType<PopoverProps['autoAdjustOverflow']>,
    default: true,
  },
  onChangeComplete: {
    type: Function as PropType<(value: Color) => void>,
    default: () => {},
  },
  showText: {
    type: [Boolean, Function] as PropType<boolean | ((color: Color) => VueNode)>,
    default: false,
  },

  size: PropTypes.oneOf(['small', 'middle', 'large']),

  destroyTooltipOnHide: PropTypes.looseBool,

  panelRender: {
    type: Function as PropType<PanelRender>,
    default: undefined,
  },
});

export type ColorPickerProps = Partial<ExtractPropTypes<ReturnType<typeof colorPickerProps>>>;

const ColorPicker = defineComponent({
  name: 'PfColorPicker',
  inheritAttrs: false,
  props: colorPickerProps(),
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, getPopupContainer, direction, size } = useConfigInject('color-picker', props);
    const value = computed(() => props.value);
    const [colorValue, setColorValue] = useColorState(DefaultColor, {
      value,
      defaultValue: props.defaultValue,
    });

    const open = computed(() => props.open);
    const [popupOpen, setPopupOpen] = useMergedState(false, {
      value: open,
      postState: openData => !props.disabled && openData,
      onChange: props.onOpenChange,
    });
    const format = computed(() => props.format);

    const [formatValue, setFormatValue] = useMergedState(props.format, {
      value: format,
      onChange: props.onFormatChange,
    });

    // ===================== Style =====================
    const mergedSize = computed(() => props.size || size.value);

    const rtlCls = computed(() => ({ [`${prefixCls.value}-rtl`]: direction.value }));
    const mergeCls = computed(() => {
      const mergeRootCls = classNames(props.rootClassName, rtlCls.value);
      return classNames(
        {
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
        },
        mergeRootCls,
      );
    });

    const mergePopupCls = computed(() => classNames(prefixCls.value, rtlCls.value));

    const colorCleared = shallowRef(false);

    const popupAllowCloseRef = shallowRef(true);

    const handleChange = (data: Color, type?: HsbaColorType, pickColor?: boolean) => {
      let color: Color = generateColor(data);
      const isNull = value.value === null || (!value.value && props.defaultValue === null);
      if (colorCleared.value || isNull) {
        colorCleared.value = false;
        const hsba = color.toHsb();
        // ignore alpha slider
        if (colorValue.value.toHsb().a === 0 && type !== 'alpha') {
          hsba.a = 1;
          color = generateColor(hsba);
        }
      }
      if (pickColor) {
        popupAllowCloseRef.value = false;
      }

      setColorValue(color);
      emit('update:value', color, color.toHexString());
      emit('change', color, color.toHexString());
    };

    const handleClear = () => {
      colorCleared.value = true;
      emit('clear');
    };
    const handleChangeComplete = color => {
      popupAllowCloseRef.value = true;
      emit('changeComplete', generateColor(color));
    };

    const onFormatChange = (format: ColorFormat) => {
      setFormatValue(format);
      emit('formatChange', format);
    };
    const popoverProps: ComputedRef<PopoverProps> = computed(() => ({
      visible: popupOpen.value,
      trigger: props.trigger,
      placement: props.placement,
      arrow: props.arrow,
      rootClassName: props.rootClassName,
      getPopupContainer: getPopupContainer.value,
      autoAdjustOverflow: props.autoAdjustOverflow,
      destroyTooltipOnHide: props.destroyTooltipOnHide,
    }));
    const colorBaseProps: ComputedRef<ColorPickerBaseProps> = computed(() => ({
      prefixCls: prefixCls.value,
      color: colorValue.value,
      allowClear: props.allowClear,
      colorCleared: colorCleared.value,
      disabled: props.disabled,
      presets: props.presets,
      format: formatValue.value,
      formatOptions: props.formatOptions,
      panelRender: props.panelRender,
      onFormatChange,
      onChangeComplete: handleChangeComplete,
    }));
    return () => {
      return (
        <Popover
          // @ts-ignore
          style={props.styles?.popup}
          // @ts-ignore
          overlayInnerStyle={props.styles?.popupOverlayInner}
          onVisibleChange={visible => {
            if (popupAllowCloseRef.value) {
              setPopupOpen(visible);
            }
          }}
          content={
            <ColorPickerPanel
              {...colorBaseProps.value}
              onChange={handleChange}
              onClear={handleClear}
            />
          }
          overlayClassName={mergePopupCls.value}
          {...popoverProps.value}
        >
          {slots.children?.() || (
            <ColorTrigger
              open={popupOpen.value}
              class={mergeCls.value}
              style={attrs.style}
              color={props.value ? generateColor(props.value) : colorValue.value}
              prefixCls={prefixCls.value}
              disabled={props.disabled}
              showText={props.showText}
              colorCleared={colorCleared.value}
            />
          )}
        </Popover>
      );
    };
  },
});

export default ColorPicker;
