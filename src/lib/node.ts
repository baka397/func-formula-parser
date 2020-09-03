import { INodeItem } from '../interfaces/node';
import { ITokenItem } from '../interfaces/token';
import { TokenSubType, TokenType } from '../types/token';
import { getMathOperatorPriority } from './common';

/**
 * 解析令牌节点
 * @param  {ITokenItem[]}   tokenList 令牌列表
 * @param  {IFormulaOption} option    选项
 * @return {INodeItem[]}              语法节点列表
 */
export function parseNode(tokenList: ITokenItem[]): INodeItem | null {
    if (tokenList.length === 0) {
        return null;
    }
    let nodeItemTree: INodeItem = {
        children: [],
        token: tokenList[0]
    }; // 节点列表结果
    let lastRootNodeItem: INodeItem = nodeItemTree;
    let curNodeIndex: number[] = []; // 节点索引
    let lastToken: ITokenItem = tokenList[0];
    tokenList.slice(1).forEach((token) => {
        const nodeItemResult = parseItemNode(token, lastToken, lastRootNodeItem, curNodeIndex, nodeItemTree);
        // 查询是否有节点列表
        if (Array.isArray(nodeItemResult)) {
            lastRootNodeItem = nodeItemResult[0];
            // 节点列表如果为空,则为根节点,直接替换
            if (nodeItemResult[1].length === 0) {
                nodeItemTree = nodeItemResult[0];
            }
            curNodeIndex = nodeItemResult[1];
        } else {
            lastRootNodeItem = nodeItemResult;
        }
        lastToken = token;
    });
    return nodeItemTree;
}

/**
 * 解析单个节点
 * @param  {ITokenItem} token            当前令牌
 * @param  {ITokenItem} lastToken        上个令牌
 * @param  {INodeItem}  lastRootNodeItem 最后一个根节点
 * @param  {number[]}   nodeIndex        节点索引
 * @param  {INodeItem}  nodeItemTree     节点树
 * @return {INodeItem}                   当前根节点,如果有额外参数,则第二个参数为新的节点索引
 */
function parseItemNode(token: ITokenItem, lastToken: ITokenItem, lastRootNodeItem: INodeItem, nodeIndex: number[], nodeItemTree: INodeItem): INodeItem | [INodeItem, number[]] {
    const nodeItem: INodeItem = {
        children: [],
        token
    };
    switch (token.type) {
        // 以下情况向下插入新节点,新增节点索引
        case TokenType.TYPE_OPERAND:
        case TokenType.TYPE_OP_PRE:
            insetNodeItem(nodeItem, lastRootNodeItem, nodeIndex);
            return nodeItem;
        // 以下情况:
        // 1. 当开始时,向下插入新节点,并向下新增节点索引,挪移根节点
        // 2. 当结束时,不插入新节点,但向上回滚到最近的起始节点
        case TokenType.TYPE_FUNCTION:
        case TokenType.TYPE_SUBEXPR:
        case TokenType.TYPE_SET:
            if (token.subType === TokenSubType.SUBTYPE_START) {
                insetNodeItem(nodeItem, lastRootNodeItem, nodeIndex);
                return nodeItem;
            }
            // 如果上一个为起始,则直接返回前一个根节点
            const prevNodeItem = getNodeItemWithIndex(nodeItemTree, nodeIndex);
            if (lastToken.subType === TokenSubType.SUBTYPE_START && lastToken.type === token.type) {
                return prevNodeItem;
            }
            return rollbackNodeItem(nodeItemTree, nodeIndex, (validNodeItem) => {
                return validNodeItem.token.subType !== TokenSubType.SUBTYPE_START;
            });
        // 以下情况:
        // 变换:变换当前节点到子节点,然后替换节点值为本节点,索引值不变,如[1,+]顺序的情况
        // 1. 如果索引<1时,则直接变换
        // 2. 如果索引>1时,则循环回滚到最近一个节点
        //     2.1 是否节点为符号且比当前优先级高,继续查询
        //     2.2 否则,在当前级查找变换,不回滚
        case TokenType.TYPE_OP_IN:
        case TokenType.TYPE_OP_POST:
            const checkIndex = nodeIndex.map((item) => {
                return item;
            });
            if (checkIndex.length > 0) {
                const tokenOperatorPriority = getMathOperatorPriority(token);
                const rollbackItem = rollbackNodeItem(nodeItemTree, checkIndex, (validNodeItem) => {
                    return getMathOperatorPriority(validNodeItem.token) > tokenOperatorPriority; // 比本次的操作优先级高
                });
                // 如果是为顶级且符合操作条件,不应处理
                if (!(checkIndex.length === 0 && getMathOperatorPriority(rollbackItem.token) > tokenOperatorPriority)) {
                    // 由于是当前级变换,所以实际索引需要从父级变回当前级
                    checkIndex.push(nodeIndex[checkIndex.length]);
                }
            }
            // 开始变换
            nodeItem.children.push(getNodeItemWithIndex(nodeItemTree, checkIndex));
            // 查询不为根节点,则查询上级节点并替换
            if (checkIndex.length > 0) {
                const exchangeNodeIndex = checkIndex.slice(0, checkIndex.length - 1);
                const exchangeNodeItem: INodeItem = getNodeItemWithIndex(nodeItemTree, exchangeNodeIndex);
                exchangeNodeItem.children.pop();
                exchangeNodeItem.children.push(nodeItem);
            }
            return [nodeItem, checkIndex];
        // 以下情况
        // 直接回滚到上级的函数/集合节点
        case TokenType.TYPE_ARGUMENT: {
            return rollbackNodeItem(nodeItemTree, nodeIndex, (validNodeItem) => {
                return validNodeItem.token.type !== TokenType.TYPE_FUNCTION && validNodeItem.token.type !== TokenType.TYPE_SET;
            });
        }
    }
    return nodeItemTree;
}

// 通过节点索引获取节点
function getNodeItemWithIndex(nodeItemTree: INodeItem, nodeIndex: number[]): INodeItem {
    let checkNodeItem: INodeItem = nodeItemTree;
    nodeIndex.forEach((curNodeIndex) => {
        checkNodeItem = checkNodeItem.children[curNodeIndex];
    });
    return checkNodeItem;
}

// 插入节点
function insetNodeItem(nodeItem: INodeItem, lastRootNodeItem: INodeItem, nodeIndex: number[]) {
    lastRootNodeItem.children.push(nodeItem);
    nodeIndex.push(lastRootNodeItem.children.length - 1);
}

/**
 * 回滚节点,直到满足条件
 * @param  {INodeItem}     nodeItemTree         原始节点树
 * @param  {number[]}      nodeIndex            当前最小根节点索引
 * @param  {number}        singleRollbackLength 单次回滚长度
 * @param  {INodeItem) => boolean}    validFunc 验证函数
 * @return {INodeItem}                          回滚当前的节点
 */
function rollbackNodeItem(nodeItemTree: INodeItem, nodeIndex: number[], validFunc: (validNodeItem: INodeItem) => boolean): INodeItem {
    // 剪切到最后一个所需执行列表
    nodeIndex.pop();
    let validNodeItem: INodeItem = getNodeItemWithIndex(nodeItemTree, nodeIndex);
    // 一直向上回滚,直到不满足验证条件为止
    while (validFunc(validNodeItem)) {
        if (nodeIndex.length === 0) { // 如果没有上级时,需要直接结束
            break;
        }
        nodeIndex.pop();
        validNodeItem = getNodeItemWithIndex(nodeItemTree, nodeIndex);
    }
    return validNodeItem;
}
