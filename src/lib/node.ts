import {IFormulaOption} from '../interfaces/common';
import {INodeItem} from '../interfaces/node';
import {ITokenItem} from '../interfaces/token';

import {ExpectType} from '../types/common';
import {TokenSubType, TokenType} from '../types/token';

import {getMathOperatorPriority} from './common';

/**
 * 解析令牌节点
 * @param  {ITokenItem[]}   tokenList 令牌列表
 * @param  {IFormulaOption} option    选项
 * @return {INodeItem[]}              语法节点列表
 */
export function parseNode(tokenList: ITokenItem[]): INodeItem {
    if (tokenList.length === 0) {
        return;
    }
    let nodeItemTree: INodeItem = {
        children: [],
        token: tokenList[0]
    }; // 节点列表结果
    let lastRootNodeItem: INodeItem = nodeItemTree;
    const curNodeIndex: number[] = []; // 节点索引
    tokenList.slice(1).forEach((token, index) => {
        const nodeItemResult = parseItemNode(token, lastRootNodeItem, curNodeIndex, nodeItemTree);
        if (nodeItemResult) {
            if (Array.isArray(nodeItemResult)) {
                lastRootNodeItem = nodeItemResult[0];
                if (nodeItemResult[1]) {
                    nodeItemTree = nodeItemResult[0];
                }
            } else {
                lastRootNodeItem = nodeItemResult;
            }
        }
    });
    return nodeItemTree;
}

/**
 * 解析单个节点
 * @param  {ITokenItem} token            当前令牌
 * @param  {INodeItem}  lastRootNodeItem 最后一个根节点
 * @param  {number[]}   nodeIndex        节点索引
 * @param  {INodeItem}  nodeItemTree     节点树
 * @return {INodeItem}                   当前根节点,如果有额外参数,则第二个参数为是否替换根节点
 */
function parseItemNode(token: ITokenItem, lastRootNodeItem: INodeItem, nodeIndex: number[], nodeItemTree: INodeItem): INodeItem | [INodeItem, boolean] {
    const nodeItem: INodeItem = {
        children: [],
        token
    };
    // 如果没有根节点,则创建一个根节点
    if (!lastRootNodeItem) {
        return nodeItem;
    }
    switch (token.type) {
        // 以下情况向下插入新节点,新增节点索引
        case TokenType.TYPE_OPERAND:
        case TokenType.TYPE_OP_PRE:
            insetNodeItem(nodeItem, lastRootNodeItem, nodeIndex);
            return nodeItem;
        // 以下情况:
        // 1. 当开始时,向下插入新节点,并向下新增节点索引,挪移根节点
        // 2. 当结束时,不插入新节点,但向上查找到最近的起始节点
        case TokenType.TYPE_FUNCTION:
        case TokenType.TYPE_SUBEXPR:
        case TokenType.TYPE_SET:
            if (token.subType === TokenSubType.SUBTYPE_START) {
                insetNodeItem(nodeItem, lastRootNodeItem, nodeIndex);
                return nodeItem;
            } else {
                const checkIndex = nodeIndex.slice(0, nodeIndex.length);
                let checkNodeItem: INodeItem = getNodeItemWithIndex(nodeItemTree, checkIndex);
                while (checkNodeItem.token.subType !== TokenSubType.SUBTYPE_START) {
                    checkIndex.splice(0, checkIndex.length - 1);
                    checkNodeItem = getNodeItemWithIndex(nodeItemTree, checkIndex);
                }
                return checkNodeItem;
            }
            break;
        // 以下情况:
        // 变换:变换当前节点到子节点,然后替换节点值为本节点,索引值不变,如[1,+]顺序的情况
        // 1. 如果索引<2时,则直接变换
        // 2. 如果索引>2时,则每2个字符循环倒查最近一个操作符号
        //     2.1 如果有符号且比当前优先级高,继续查询
        //     2.2 如果没有,直接变换
        case TokenType.TYPE_OP_PRE:
        case TokenType.TYPE_OP_IN:
        case TokenType.TYPE_OP_POST:
            if (nodeIndex.length > 2) {
                const tokenOperatorPriority = getMathOperatorPriority(token);
                const checkIndex = nodeIndex.slice(0, nodeIndex.length - 2);
                let checkNodeItem: INodeItem = getNodeItemWithIndex(nodeItemTree, checkIndex);
                while (
                    checkIndex.length >= 2 && // 上级还有数据
                    checkNodeItem && // 本次查找有值
                    checkNodeItem.token.subType === TokenSubType.SUBTYPE_MATH && // 本次查询的内容为数学公式
                    getMathOperatorPriority(checkNodeItem.token) > tokenOperatorPriority // 比本次的操作优先级高
                ) {
                    checkIndex.splice(0, checkIndex.length - 2);
                    checkNodeItem = getNodeItemWithIndex(nodeItemTree, checkIndex);
                }
                nodeIndex = checkIndex;
            }
            // 开始变换
            nodeItem.children.push(lastRootNodeItem);
            // 查询是否为根节点
            if (nodeIndex.length > 0) {
                const exchangeNodeIndex = nodeIndex.slice(0, nodeIndex.length - 1);
                const exchangeNodeItem: INodeItem = getNodeItemWithIndex(nodeItemTree, exchangeNodeIndex);
                exchangeNodeItem.children.pop();
                exchangeNodeItem.children.push(nodeItem);
                return nodeItem;
            }
            return [nodeItem, true];
    }
    return;
}

// 通过节点索引获取节点
function getNodeItemWithIndex(nodeItemTree: INodeItem, nodeIndex: number[]): INodeItem {
    let checkNodeItem: INodeItem = nodeItemTree;
    nodeIndex.forEach((curNodeIndex) => {
        checkNodeItem = nodeItemTree.children[curNodeIndex];
    });
    return checkNodeItem;
}

// 插入节点
function insetNodeItem(nodeItem: INodeItem, lastRootNodeItem: INodeItem, nodeIndex: number[]) {
    lastRootNodeItem.children.push(nodeItem);
    nodeIndex.push(lastRootNodeItem.children.length - 1);
}
