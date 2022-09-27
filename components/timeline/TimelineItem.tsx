import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import SuccessTwoTone from 'pf-icons-vue/SuccessTwoTone';

export const timelineItemProps = () => ({
  prefixCls: String,
  color: String,
  dot: PropTypes.any,
  pending: { type: Boolean, default: undefined },
  position: PropTypes.oneOf(tuple('left', 'right', '')).def(''),
  label: PropTypes.any,
});

export type TimelineItemProps = Partial<ExtractPropTypes<ReturnType<typeof timelineItemProps>>>;

export default defineComponent({
  name: 'ATimelineItem',
  props: initDefaultProps(timelineItemProps(), {
    color: 'blue',
    pending: false,
  }),
  slots: ['dot', 'label'],
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('timeline', props);
    return () => {
      const { color = '', pending, label = slots.label?.(), dot = slots.dot?.() } = props;
      const itemClassName = classNames({
        [`${prefixCls.value}-item`]: true,
        [`${prefixCls.value}-item-pending`]: pending,
        [`${prefixCls.value}-item-blue-line`]: color === 'blue',
      });

      const dotClassName = classNames({
        [`${prefixCls.value}-item-head`]: true,
        [`${prefixCls.value}-item-head-custom`]: dot || color === 'blue',
        [`${prefixCls.value}-item-head-${color}`]: true,
      });
      const customColor = /blue|red|green|gray|yellow/.test(color || '') ? undefined : color;
      return (
        <li class={itemClassName}>
          {label && <div class={`${prefixCls.value}-item-label`}>{label}</div>}
          <div class={`${prefixCls.value}-item-tail`} />
          <div class={dotClassName} style={{ borderColor: customColor, color: customColor }}>
            {dot || (color === 'blue' && <SuccessTwoTone /> )}
          </div>
          <div class={`${prefixCls.value}-item-content`}>{slots.default?.()}</div>
        </li>
      );
    };
  },
});
