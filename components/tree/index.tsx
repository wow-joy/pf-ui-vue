import type { App } from 'vue';
import { defineComponent } from 'vue';
import Tree from './Tree';
import TreeOperationIcon from './TreeOperationIcon';
import { TreeNode as VcTreeNode } from '../vc-tree';
import DirectoryTree from './DirectoryTree';
import { treeNodeProps } from '../vc-tree/props';

export type { EventDataNode, DataNode } from '../vc-tree/interface';

export type {
  TreeProps,
  AntTreeNodeMouseEvent,
  AntTreeNodeExpandedEvent,
  AntTreeNodeCheckedEvent,
  AntTreeNodeSelectedEvent,
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  AntdTreeNodeAttribute,
  TreeDataItem,
} from './Tree';

export type {
  DirectoryTreeProps,
} from './DirectoryTree';

/* istanbul ignore next */

const TreeNode = defineComponent({ ...VcTreeNode, name: 'PfTreeNode', props: treeNodeProps });

export { DirectoryTree, TreeNode, TreeOperationIcon };

export default Object.assign(Tree, {
  DirectoryTree,
  TreeNode,
  TreeOperationIcon,
  install: (app: App) => {
    app.component(Tree.name, Tree);
    app.component(TreeNode.name, TreeNode);
    app.component(DirectoryTree.name, DirectoryTree);
    app.component(TreeOperationIcon.name, TreeOperationIcon);
    return app;
  },
});
