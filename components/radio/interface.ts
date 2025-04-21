import type { RadioProps } from './Radio';
import type { Ref } from 'vue';
export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean;
}

export type RadioGroupButtonStyle = 'outline' | 'solid' | 'simple' | 'minor-simple';
export type RadioGroupOptionType = 'default' | 'button';

export interface RadioChangeEvent {
  target: RadioChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface RadioGroupContext {
  stateValue: Ref;
  props: RadioProps & { aequilate: boolean };
  onRadioChange: (e: RadioChangeEvent) => void;
  childWidths: Ref<number[]>;
  childMaxWidth: Ref<number | null>;
}
