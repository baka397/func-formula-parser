import { TokenSubType, TokenType } from '../types/token';

// 节点内容
export interface INodeItem {
    type: TokenType; // 类型
    subType: TokenSubType; // 子类型
    token: string; // 令牌内容
    child: INodeItem[]; // 子节点
    loc: { // 定位
        start: number, // 起始节点
        end: number, // 结束节点
        row: number // 行数
    };
}
