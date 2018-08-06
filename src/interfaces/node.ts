import { ITokenItem } from './token';

// 节点内容
export interface INodeItem {
    token: ITokenItem; // 节点信息
    children: INodeItem[]; // 子节点信息
}
