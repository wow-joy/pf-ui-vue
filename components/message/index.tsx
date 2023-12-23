import type { CSSProperties } from 'vue';
import Notification from '../vc-notification';
import { LoadingFilled, InfoOutlined, AlertOutlined, SuccessOutlined, ErrorOutlined } from '@pf-ui/pf-icons-vue'
import type { Key, VueNode } from '../_util/type';
import type { NotificationInstance } from '../vc-notification/Notification';
import classNames from '../_util/classNames';

let defaultDuration = 3;
let defaultTop: string;
let messageInstance: NotificationInstance;
let key = 1;
let localPrefixCls = '';
let transitionName = 'move-up';
let hasTransitionName = false;
let getContainer = () => document.body;
let maxCount: number;
let rtl = false;
let defaultHoverRemain = false;

export function getKeyThenIncreaseKey() {
  return key++;
}

export interface ConfigOptions {
  top?: string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
  hoverRemain?: boolean;
}

function setMessageConfig(options: ConfigOptions) {
  if (options.top !== undefined) {
    defaultTop = options.top;
    messageInstance = null; // delete messageInstance for new defaultTop
  }
  if (options.duration !== undefined) {
    defaultDuration = options.duration;
  }

  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls;
  }
  if (options.getContainer !== undefined) {
    getContainer = options.getContainer;
    messageInstance = null; // delete messageInstance for new getContainer
  }
  if (options.transitionName !== undefined) {
    transitionName = options.transitionName;
    messageInstance = null; // delete messageInstance for new transitionName
    hasTransitionName = true;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
    messageInstance = null;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
  if (options.hoverRemain !== undefined) {
    defaultHoverRemain = options.hoverRemain;
  }
}

function getMessageInstance(args: MessageArgsProps, callback: (i: NotificationInstance) => void) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      appContext: args.appContext,
      prefixCls: args.prefixCls || localPrefixCls,
      rootPrefixCls: args.rootPrefixCls,
      transitionName,
      hasTransitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer: getContainer || args.getPopupContainer,
      maxCount,
      name: 'message',
      hoverRemain: args.hoverRemain,
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ThenableArgument {
  (val: any): void;
}

const typeToIcon = {
  info: InfoOutlined,
  success: SuccessOutlined,
  error: ErrorOutlined,
  warning: AlertOutlined,
  loading: LoadingFilled,
};

export interface MessageType extends PromiseLike<any> {
  (): void;
}

export interface MessageArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration?: number;
  type?: NoticeType;
  prefixCls?: string;
  rootPrefixCls?: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: CSSProperties;
  class?: string;
  appContext?: any;
  onClick?: (e: MouseEvent) => void;
  closeable?: boolean;
  hoverRemain?: boolean;
}

function notice(args: MessageArgsProps): MessageType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  args.hoverRemain = args.hoverRemain !== undefined ? args.hoverRemain : defaultHoverRemain;

  const target = args.key || getKeyThenIncreaseKey();
  // todo
  // const closeable = !!args.closeable
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(args, instance => {
      instance.notice({
        key: target,
        duration,
        hoverRemain: args.hoverRemain,
        // closeable,
        style: args.style || {},
        class: args.class,
        content: ({ prefixCls }) => {
          const Icon = typeToIcon[args.type];
          const iconNode = Icon ? <Icon /> : '';
          const messageClass = classNames(`${prefixCls}-custom-content`, {
            [`${prefixCls}-${args.type}`]: args.type,
            [`${prefixCls}-rtl`]: rtl === true,
          });
          return (
            <div class={messageClass}>
              {typeof args.icon === 'function' ? args.icon() : args.icon || iconNode}
              <span>{typeof args.content === 'function' ? args.content() : args.content}</span>
              {/* {closeable ? <CloseOutlined  /> : null} */}
            </div>
          );
        },
        onClose: callback,
        onClick: args.onClick,
      });
    });
  });
  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

type ConfigDuration = number;
type JointContent = VueNode | MessageArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is MessageArgsProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as MessageArgsProps).content
  );
}

const api: any = {
  open: notice,
  config: setMessageConfig,
  destroy(messageKey?: Key) {
    if (messageInstance) {
      if (messageKey) {
        const { removeNotice } = messageInstance;
        removeNotice(messageKey);
      } else {
        const { destroy } = messageInstance;
        destroy();
        messageInstance = null;
      }
    }
  },
};

export function attachTypeApi(originalApi: MessageApi, type: NoticeType) {
  originalApi[type] = (
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ) => {
    if (isArgsProps(content)) {
      return originalApi.open({ ...content, type });
    }

    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return originalApi.open({ content, duration, type, onClose });
  };
}

(['success', 'info', 'warning', 'error', 'loading'] as NoticeType[]).forEach(type =>
  attachTypeApi(api, type),
);

api.warn = api.warning;

export interface MessageInstance {
  info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  open(args: MessageArgsProps): MessageType;
}

export interface MessageApi extends MessageInstance {
  warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  config(options: ConfigOptions): void;
  destroy(messageKey?: Key): void;
}

/** @private test Only function. Not work on production */
export const getInstance = () => (process.env.NODE_ENV === 'test' ? messageInstance : null);

export default api as MessageApi;
