import { TokenSubType, TokenType } from '../types/token';

// 令牌内容
export interface ITokenItem {
    parentType?: TokenType; // 父类型
    type: TokenType; // 类型
    subType: TokenSubType; // 子类型
    sourceToken: string; // 令牌原始匹配内容
    token: string; // 令牌内容
    loc?: { // 定位
        sourceStart: number, // 原始公式字符串节点
        sourceEnd: number, // 原始公式字符串结束点
        start: number, // 起始节点
        end: number, // 结束节点
        row: number // 行数
    };
}
