import {ITokenItem} from '../interfaces/token';

import {ExpectType} from '../types/common';
import {TokenSubType, TokenSubTypeExpReg, TokenType} from '../types/token';

import {getExpectTypeByToken} from './common';

/**
 * 解析令牌
 * @param  {string}       formula 公式字符串
 * @return {ITokenItem[]}         公式结果
 */
export function parseToken(formula: string): ITokenItem[] {
    const formulaList: string[] = formula.split('\n');
    let curTokenItem: ITokenItem = {
        loc: {
            end: 0,
            row: 0,
            sourceEnd: 0,
            sourceStart: 0,
            start: 0
        },
        sourceToken: '',
        subType: TokenSubType.SUBTYPE_EMPTY,
        token: '',
        type: TokenType.TYPE_START
    };
    let curTokenArray: ITokenItem[] = []; // 令牌字符串
    const curParentTokenTypeList: TokenType[] = []; // 当前父级令牌类型列表
    formulaList.forEach((curFormula, index) => {
        curTokenArray = curTokenArray.concat(parseLineToken(curFormula, index + 1, curTokenItem, curParentTokenTypeList));
        const lastTokenItem = curTokenArray[curTokenArray.length - 1];
        // 处理节点空值的情况,返回数据
        if (lastTokenItem) {
            curTokenItem = lastTokenItem;
        }
    });
    // 检查是否没有闭合
    if (curParentTokenTypeList.length > 0) {
        throwSyntaxError(formulaList.length + 1, 0, '', `Need closure`);
    }
    // 检查最后一个类型是否为闭合期望
    if (!isClosedToken(curTokenItem)) {
        throwSyntaxError(formulaList.length + 1, 0, '', `Illegal end symbol`);
    }
    return curTokenArray;
}

function throwSyntaxError(line: number, col: number, formulaStr: string, desc: string) {
    throw new SyntaxError(`Token parse Error(${line}:${col}): "${formulaStr}"
        ${desc}`);
}

// 单行解析令牌
function parseLineToken(formulaStr: string, line: number, lastTokenItem: ITokenItem, lastParentTokenTypeList: TokenType[]): ITokenItem[] {
    const curLineTokenList: ITokenItem[] = []; // 当前数据
    const curLastTokenType: TokenType = lastParentTokenTypeList[0] || null;
    let curTokenItem: ITokenItem = lastTokenItem; // 当前令牌
    let curStart: number = 0; // 当前起始点
    let sourceStart: number = lastTokenItem.loc.sourceEnd; // 当前起始点
    let sourceEnd: number = sourceStart; // 当前结束点
    // 如果没有节点,则直接返回
    if (formulaStr.length === 0) {
        return curLineTokenList;
    }
    // 当节点结束时
    while (formulaStr.length > 0) {
        const tokenObj = parseType(formulaStr, curTokenItem);
        const tokenItem = tokenObj.item;
        if (!tokenItem) {
            throwSyntaxError(line, curStart, formulaStr, `${curTokenItem.type} expect: ${tokenObj.expectTypeList.map((item) => {
                return `${item[0]}${item[1] ? ':' + item[1] : ''}`;
            }).join(',')}`);
        }
        formulaStr = formulaStr.substring(tokenItem.sourceToken.length);
        // 如果是空格时,跳过,并记录节点
        if (tokenItem.type === TokenType.TYPE_SPACE) {
            sourceStart = sourceStart + tokenItem.sourceToken.length;
            sourceEnd = sourceEnd + tokenItem.sourceToken.length;
            curStart = curStart + tokenItem.sourceToken.length;
            continue;
        }
        // 更新数据
        // 更新坐标
        tokenItem.loc = {
            end: curStart + tokenItem.sourceToken.length,
            row: line,
            sourceEnd: sourceEnd + tokenItem.sourceToken.length,
            sourceStart,
            start: curStart
        };
        // 检测是否需要回滚到上级父令牌
        const isNeedRollback = isNeedRollbackParentToken(tokenItem);
        if (isNeedRollback) {
            lastParentTokenTypeList.shift();
        }
        // 插入当前令牌
        tokenItem.parentType = lastParentTokenTypeList[0] || null;
        // 检测是否需要插入一个新的上级令牌
        const curParentTokenType = getParentTokenTypeName(tokenItem, curLineTokenList);
        // 如果有父级类型插入
        if (curParentTokenType) {
            lastParentTokenTypeList.unshift(curParentTokenType);
        }
        curLineTokenList.push(tokenItem);
        curTokenItem = tokenItem;
        // 重置索引坐标
        curStart = tokenItem.loc.end;
        sourceStart = tokenItem.loc.sourceEnd;
        sourceEnd = tokenItem.loc.sourceEnd;
    }
    return curLineTokenList;
}

/**
 * 解析起始公式
 * @param  {string}     formula 公式
 * @return {ITokenItem}         令牌对象
 */
function parseType(formula: string, prevTokenItem: ITokenItem): {
    expectTypeList: ExpectType[],
    item: ITokenItem
} {
    const expectTypeList: ExpectType[] = getExpectTypeByToken(prevTokenItem);
    const tokenItem = parseFormulaStr(formula, expectTypeList);
    // 如果是结束符时,设置当前类型为父类型
    if (tokenItem && tokenItem.subType === TokenSubType.SUBTYPE_STOP) {
        // 检测前一个类型是否为闭合直接设置父类型或
        tokenItem.type = isParentToken(prevTokenItem) ? prevTokenItem.type : prevTokenItem.parentType;
    }
    return {
        expectTypeList,
        item: tokenItem
    };
}

/**
 * 解析公式字符串
 * @param  {string}      formula  公式字符串
 * @param  {TokenType[]} typeList 字符串列表
 * @return {ITokenItem}           令牌对象
 */
function parseFormulaStr(formula: string, typeList: ExpectType[]): ITokenItem {
    let tokenItem: ITokenItem;
    // 检查空格
    tokenItem = spaceTokenMatch(formula, TokenType.TYPE_SPACE);
    if (tokenItem) {
        return tokenItem;
    }
    const result = typeList.some((type) => {
        const curType: TokenType = type[0];
        const curExpectSubType: TokenSubType = type[1];
        switch (curType) {
            case TokenType.TYPE_OPERAND: // 操作对象
                tokenItem = numberTokenMatch(formula, curType);
                const varTokenItem: ITokenItem = variableTokenMatch(formula, curType);
                if (!tokenItem) {
                    tokenItem = varTokenItem;
                } else {
                    // 如果数字类变量和字符串类变量不一致,则使用字符串变量
                    if (tokenItem.sourceToken.length < varTokenItem.sourceToken.length) {
                        tokenItem = varTokenItem;
                    }
                }
                break;
            case TokenType.TYPE_FUNCTION: // 函数
                tokenItem = functionTokenMatch(formula, curType);
                break;
            case TokenType.TYPE_SUBEXPR: // 子表达式
                tokenItem = subexpressionTokenMatch(formula, curType, curExpectSubType);
                break;
            case TokenType.TYPE_OP_PRE: // 前置操作符
                tokenItem = mathTokenMatch(formula, curType);
                break;
            case TokenType.TYPE_OP_IN: // 中置操作符
                tokenItem = mathTokenMatch(formula, curType);
                if (!tokenItem) {
                    tokenItem = logicalTokenMatch(formula, curType);
                }
                break;
            case TokenType.TYPE_OP_POST: // 后置操作符
                tokenItem = mathTokenMatch(formula, curType);
                break;
            case TokenType.TYPE_ARGUMENT: // 参数
                tokenItem = argumentTokenMatch(formula, curType);
                break;
            case TokenType.TYPE_SET: // 集合
                tokenItem = setTokenMatch(formula, curType, curExpectSubType);
                break;
        }
        if (tokenItem) {
            return true;
        }
        return false;
    });
    return tokenItem;
}

// 获取父级令牌名称
function getParentTokenTypeName(tokenItem: ITokenItem, tokenList: ITokenItem[]): TokenType {
    const curTokenType = tokenItem.type;
    switch (curTokenType) {
        // 以下类型会返回自身为父级令牌
        case TokenType.TYPE_FUNCTION:
        case TokenType.TYPE_SET:
        case TokenType.TYPE_SUBEXPR:
            if (tokenItem.subType === TokenSubType.SUBTYPE_STOP) {
                return null;
            }
            return curTokenType;
        default: // 非特殊的留空
            return null;
    }
}

// 是否需要回滚父级
function isNeedRollbackParentToken(tokenItem: ITokenItem): boolean {
    return tokenItem.subType === TokenSubType.SUBTYPE_STOP;
}

// 是否是闭合元素
function isClosedToken(tokenItem: ITokenItem): boolean {
    switch (tokenItem.type) {
        // 以下类型需要特殊判断
        case TokenType.TYPE_OPERAND:
        case TokenType.TYPE_SUBEXPR:
        case TokenType.TYPE_FUNCTION:
        case TokenType.TYPE_SUBEXPR:
        case TokenType.TYPE_OP_POST:
            return true;
    }
    return false;
}

// 是否为父级元素
function isParentToken(tokenItem: ITokenItem): boolean {
    switch (tokenItem.type) {
        // 以下类型需要特殊判断
        case TokenType.TYPE_FUNCTION:
        case TokenType.TYPE_SUBEXPR:
            return true;
    }
    return false;
}

/**
 * 以下为各个匹配数据类型函数
 */

// 匹配数字令牌
function spaceTokenMatch(formula: string, type: TokenType): ITokenItem {
    const spaceMatch = formula.match(TokenSubTypeExpReg.SPACE);
    if (spaceMatch) {
        return {
            sourceToken: spaceMatch[0],
            subType: TokenSubType.SUBTYPE_EMPTY,
            token: '',
            type
        };
    }
}

// 匹配数字令牌
function numberTokenMatch(formula: string, type: TokenType): ITokenItem {
    const numberMatch = formula.match(TokenSubTypeExpReg.NUMBER);
    if (numberMatch) {
        return {
            sourceToken: numberMatch[0],
            subType: TokenSubType.SUBTYPE_NUMBER,
            token: numberMatch[0],
            type
        };
    }
}

// 匹配函数令牌
function functionTokenMatch(formula: string, type: TokenType): ITokenItem {
    const variableMatch = formula.match(TokenSubTypeExpReg.FUNCTION);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: TokenSubType.SUBTYPE_START,
            token: variableMatch[1],
            type
        };
    }
}

// 匹配变量令牌
function variableTokenMatch(formula: string, type: TokenType): ITokenItem {
    const variableMatch = formula.match(TokenSubTypeExpReg.VARIABLE);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: TokenSubType.SUBTYPE_VARIABLE,
            token: variableMatch[0],
            type
        };
    }
}

// 匹配子表达式令牌
function subexpressionTokenMatch(formula: string, type: TokenType, expectSubType?: TokenSubType): ITokenItem {
    if (formula[0] === '(') {
        if (expectSubType && expectSubType !== TokenSubType.SUBTYPE_START) {
            return null;
        }
        return {
            sourceToken: '(',
            subType: TokenSubType.SUBTYPE_START,
            token: '',
            type
        };
    }
    if (formula[0] === ')') {
        if (expectSubType && expectSubType !== TokenSubType.SUBTYPE_STOP) {
            return null;
        }
        return {
            sourceToken: ')',
            subType: TokenSubType.SUBTYPE_STOP,
            token: '',
            type
        };
    }
}

// 匹配数学令牌
function mathTokenMatch(formula: string, type: TokenType): ITokenItem {
    let matchExpReg: RegExp;
    switch (type) {
        case TokenType.TYPE_OP_PRE:
            matchExpReg = TokenSubTypeExpReg.PRE_MATH;
            break;
        case TokenType.TYPE_OP_IN:
            matchExpReg = TokenSubTypeExpReg.MATH;
            break;
        case TokenType.TYPE_OP_POST:
            matchExpReg = TokenSubTypeExpReg.POST_MATH;
            break;
    }
    const mathMatch = formula.match(matchExpReg);
    if (mathMatch) {
        return {
            sourceToken: mathMatch[0],
            subType: TokenSubType.SUBTYPE_MATH,
            token: mathMatch[0],
            type
        };
    }
}

// 匹配逻辑令牌
function logicalTokenMatch(formula: string, type: TokenType): ITokenItem {
    const logicalMatch = formula.match(TokenSubTypeExpReg.LOGICAL);
    if (logicalMatch) {
        return {
            sourceToken: logicalMatch[0],
            subType: TokenSubType.SUBTYPE_LOGICAL,
            token: logicalMatch[0],
            type
        };
    }
}

// 匹配操作符
function argumentTokenMatch(formula: string, type: TokenType): ITokenItem {
    if (formula[0] === ',') {
        return {
            sourceToken: ',',
            subType: TokenSubType.SUBTYPE_EMPTY,
            token: '',
            type
        };
    }
}

// 匹配集合令牌
function setTokenMatch(formula: string, type: TokenType, expectSubType?: TokenSubType): ITokenItem {
    if (formula[0] === '{') {
        if (expectSubType && expectSubType !== TokenSubType.SUBTYPE_START) {
            return null;
        }
        return {
            sourceToken: '{',
            subType: TokenSubType.SUBTYPE_START,
            token: '',
            type
        };
    }
    if (formula[0] === '}') {
        if (expectSubType && expectSubType !== TokenSubType.SUBTYPE_STOP) {
            return null;
        }
        return {
            sourceToken: '}',
            subType: TokenSubType.SUBTYPE_STOP,
            token: '',
            type
        };
    }
}
