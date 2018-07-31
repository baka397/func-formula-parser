"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../types/token");
/**
 * 解析令牌
 * @param  {string}       formula 公式字符串
 * @return {ITokenItem[]}         公式结果
 */
function parseToken(formula) {
    const formulaList = formula.split('\n');
    let curTokenItem = {
        sourceToken: '',
        subType: token_1.TokenSubType.SUBTYPE_EMPTY,
        token: '',
        type: token_1.TokenType.TYPE_START
    };
    let curTokenArray = []; // 令牌字符串
    formulaList.forEach((curFormula, index) => {
        curTokenArray = curTokenArray.concat(parseLineToken(curFormula, index + 1, curTokenItem));
        const lastTokenItem = curTokenArray[curTokenArray.length - 1];
        // 处理节点空值的情况,返回数据
        if (lastTokenItem) {
            curTokenItem = lastTokenItem;
        }
    });
    return curTokenArray;
}
exports.parseToken = parseToken;
function throwSyntaxError(line, col, formulaStr, desc) {
    throw new SyntaxError(`Token parse Error(${line}:${col}): "${formulaStr}"
        ${desc}`);
}
// 单行解析令牌
function parseLineToken(formula, line, lastTokenItem) {
    const curLineTokenList = []; // 当前数据
    const curLastTokenType = getParentTokenTypeName(lastTokenItem.type, lastTokenItem.subType, curLineTokenList);
    // 当前令牌父类列表, 查看上级令牌类型是否为父类型,是的话,默认添加到父类型
    const parentTokenTypeList = curLastTokenType ? [curLastTokenType] : [];
    // 大写并去除公式空格
    let formulaStr = formula.toUpperCase().replace(/\s/g, '');
    let curTokenItem = lastTokenItem; // 当前令牌
    let curStart = 0; // 当前起始点
    // 如果没有节点,则直接返回
    if (formulaStr.length === 0) {
        return curLineTokenList;
    }
    // 当节点结束时
    while (formulaStr.length > 0) {
        const tokenObj = parseType(formulaStr, curTokenItem);
        const tokenItem = tokenObj.item;
        if (!tokenItem) {
            throwSyntaxError(line, curStart, formulaStr, `${curTokenItem.type} expect: ${tokenObj.expectType.map((item) => {
                return `${item[0]}${item[1] ? ':' + item[1] : ''}`;
            }).join(',')}`);
        }
        tokenItem.parentType = parentTokenTypeList[0] || null;
        const curParentTokenType = getParentTokenTypeName(tokenItem.type, tokenItem.subType, curLineTokenList);
        // 如果有父级类型插入
        if (curParentTokenType) {
            parentTokenTypeList.unshift(curParentTokenType);
        }
        const isNeedRollback = isNeedRollbackParentToken(tokenItem);
        if (isNeedRollback) {
            if (parentTokenTypeList.length === 0) {
                throwSyntaxError(line, curStart, formulaStr, `Extra closure`);
            }
            parentTokenTypeList.shift();
        }
        tokenItem.loc = {
            end: curStart + tokenItem.sourceToken.length,
            row: line,
            start: curStart
        };
        // 更新数据
        curLineTokenList.push(tokenItem);
        curTokenItem = tokenItem;
        curStart = tokenItem.loc.end;
        formulaStr = formulaStr.substring(tokenItem.sourceToken.length);
    }
    if (parentTokenTypeList.length > 0) {
        throwSyntaxError(line, curStart, formulaStr, `Need closure`);
    }
    return curLineTokenList;
}
/**
 * 解析起始公式
 * @param  {string}     formula 公式
 * @return {ITokenItem}         令牌对象
 */
function parseType(formula, curTokenItem) {
    let curTypeList = []; // [当前令牌类型, 预期的令牌子类型?]
    const curParentType = curTokenItem.parentType;
    const curSubType = curTokenItem.subType;
    const curType = curTokenItem.type;
    // 对嵌入型参数插入通用类型
    function insetWrapCommonType() {
        switch (curParentType) {
            case null: // 不存在父级时
                break;
            case token_1.TokenType.TYPE_FUNCTION: // 如果父类型是函数时,可以插入参数符
                curTypeList.push([token_1.TokenType.TYPE_ARGUMENT, null]);
            default: // 如果父类型存在,则可以插入结束符
                curTypeList.push([token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_STOP]);
                break;
        }
    }
    switch (curType) {
        case token_1.TokenType.TYPE_START:
            curTypeList = [
                [token_1.TokenType.TYPE_OPERAND, null],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_VARIABLE, null],
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_OP_PRE, null]
            ];
            break;
        case token_1.TokenType.TYPE_OPERAND:
        case token_1.TokenType.TYPE_VARIABLE:
            curTypeList = [
                [token_1.TokenType.TYPE_OP_IN, null],
                [token_1.TokenType.TYPE_OP_POST, null]
            ];
            insetWrapCommonType();
            break;
        case token_1.TokenType.TYPE_FUNCTION:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    curTypeList = [
                        [token_1.TokenType.TYPE_OPERAND, null],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_VARIABLE, null],
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_SET, token_1.TokenSubType.SUBTYPE_START] // 集合起始
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    curTypeList = [
                        [token_1.TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case token_1.TokenType.TYPE_SUBEXPR:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    curTypeList = [
                        [token_1.TokenType.TYPE_OPERAND, null],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_VARIABLE, null],
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_OP_PRE, null]
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    curTypeList = [
                        [token_1.TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case token_1.TokenType.TYPE_OP_PRE:
            curTypeList = [
                [token_1.TokenType.TYPE_OPERAND, null],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_VARIABLE, null],
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START]
            ];
            break;
        case token_1.TokenType.TYPE_OP_IN:
            curTypeList = [
                [token_1.TokenType.TYPE_OPERAND, null],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_VARIABLE, null],
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START]
            ];
            break;
        case token_1.TokenType.TYPE_OP_POST:
            curTypeList = [
                [token_1.TokenType.TYPE_OP_IN, null]
            ];
            insetWrapCommonType();
            break;
        case token_1.TokenType.TYPE_ARGUMENT:
            curTypeList = [
                [token_1.TokenType.TYPE_OPERAND, null],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_VARIABLE, null],
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_SET, token_1.TokenSubType.SUBTYPE_START]
            ];
            break;
        case token_1.TokenType.TYPE_SET:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    curTypeList = [
                        [token_1.TokenType.TYPE_OPERAND, null],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_VARIABLE, null],
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_OP_PRE, null]
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    insetWrapCommonType();
                    break;
            }
            break;
    }
    const tokenItem = parseFormulaStr(formula, curTypeList);
    // 如果是结束符时,设置当前类型为父类型
    if (tokenItem && tokenItem.subType === token_1.TokenSubType.SUBTYPE_STOP) {
        tokenItem.type = curParentType;
    }
    return {
        expectType: curTypeList,
        item: tokenItem
    };
}
/**
 * 解析公式字符串
 * @param  {string}      formula  公式字符串
 * @param  {TokenType[]} typeList 字符串列表
 * @return {ITokenItem}           令牌对象
 */
function parseFormulaStr(formula, typeList) {
    let tokenItem;
    const result = typeList.some((type) => {
        const curType = type[0];
        const curSubType = type[1];
        switch (curType) {
            case token_1.TokenType.TYPE_OPERAND: // 操作对象
                tokenItem = NumberTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_FUNCTION: // 函数
                tokenItem = functionTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_SUBEXPR: // 子表达式
                tokenItem = subexpressionTokenMatch(formula, curType, curSubType);
                break;
            case token_1.TokenType.TYPE_OP_PRE: // 前置操作符
                tokenItem = mathTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_OP_IN: // 中置操作符
                tokenItem = mathTokenMatch(formula, curType);
                if (!tokenItem) {
                    tokenItem = logicalTokenMatch(formula, curType);
                }
                break;
            case token_1.TokenType.TYPE_OP_POST: // 后置操作符
                tokenItem = mathTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_ARGUMENT: // 参数
                tokenItem = argumentTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_SET: // 集合
                tokenItem = setTokenMatch(formula, curType, curSubType);
                break;
            case token_1.TokenType.TYPE_VARIABLE: // 变量
                tokenItem = variableTokenMatch(formula, curType);
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
function getParentTokenTypeName(tokenType, tokenSubType, tokenList) {
    switch (tokenType) {
        // 以下类型会返回自身为父级令牌
        case token_1.TokenType.TYPE_FUNCTION:
        case token_1.TokenType.TYPE_SET:
        case token_1.TokenType.TYPE_SUBEXPR:
            if (tokenSubType === token_1.TokenSubType.SUBTYPE_STOP) {
                return null;
            }
            return tokenType;
        default: // 非特殊的留空
            return null;
    }
}
// 是否需要回滚父级
function isNeedRollbackParentToken(curTokenItem) {
    switch (curTokenItem.type) {
        // 以下类型需要特殊判断
        case token_1.TokenType.TYPE_SUBEXPR:
        case token_1.TokenType.TYPE_FUNCTION:
        case token_1.TokenType.TYPE_SET:
            // 当发现为子表达式结束时,则需要回滚父级
            if (curTokenItem.subType === token_1.TokenSubType.SUBTYPE_STOP) {
                return true;
            }
            break;
    }
    return false;
}
/**
 * 以下为各个匹配数据类型函数
 */
// 匹配数字令牌
function NumberTokenMatch(formula, type) {
    const numberMatch = formula.match(token_1.TokenSubTypeExpReg.NUMBER);
    if (numberMatch) {
        return {
            sourceToken: numberMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_NUMBER,
            token: numberMatch[0],
            type
        };
    }
}
// 匹配函数令牌
function functionTokenMatch(formula, type) {
    const variableMatch = formula.match(token_1.TokenSubTypeExpReg.FUNCTION);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_START,
            token: variableMatch[1],
            type
        };
    }
}
// 匹配变量令牌
function variableTokenMatch(formula, type) {
    const variableMatch = formula.match(token_1.TokenSubTypeExpReg.VARIABLE);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_VARIABLE,
            token: variableMatch[0],
            type
        };
    }
}
// 匹配子表达式令牌
function subexpressionTokenMatch(formula, type, expectSubType) {
    if (formula[0] === '(') {
        if (expectSubType && expectSubType !== token_1.TokenSubType.SUBTYPE_START) {
            return null;
        }
        return {
            sourceToken: '(',
            subType: token_1.TokenSubType.SUBTYPE_START,
            token: '',
            type
        };
    }
    if (formula[0] === ')') {
        if (expectSubType && expectSubType !== token_1.TokenSubType.SUBTYPE_STOP) {
            return null;
        }
        return {
            sourceToken: ')',
            subType: token_1.TokenSubType.SUBTYPE_STOP,
            token: '',
            type
        };
    }
}
// 匹配数学令牌
function mathTokenMatch(formula, type) {
    let matchExpReg;
    switch (type) {
        case token_1.TokenType.TYPE_OP_PRE:
            matchExpReg = token_1.TokenSubTypeExpReg.PRE_MATH;
            break;
        case token_1.TokenType.TYPE_OP_IN:
            matchExpReg = token_1.TokenSubTypeExpReg.MATH;
            break;
        case token_1.TokenType.TYPE_OP_POST:
            matchExpReg = token_1.TokenSubTypeExpReg.POST_MATH;
            break;
    }
    const mathMatch = formula.match(matchExpReg);
    if (mathMatch) {
        return {
            sourceToken: mathMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_MATH,
            token: mathMatch[0],
            type
        };
    }
}
// 匹配逻辑令牌
function logicalTokenMatch(formula, type) {
    const logicalMatch = formula.match(token_1.TokenSubTypeExpReg.LOGICAL);
    if (logicalMatch) {
        return {
            sourceToken: logicalMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_MATH,
            token: logicalMatch[0],
            type
        };
    }
}
// 匹配操作符
function argumentTokenMatch(formula, type) {
    if (formula[0] === ',') {
        return {
            sourceToken: ',',
            subType: token_1.TokenSubType.SUBTYPE_EMPTY,
            token: '',
            type
        };
    }
}
// 匹配集合令牌
function setTokenMatch(formula, type, expectSubType) {
    if (formula[0] === '{') {
        if (expectSubType && expectSubType !== token_1.TokenSubType.SUBTYPE_START) {
            return null;
        }
        return {
            sourceToken: '{',
            subType: token_1.TokenSubType.SUBTYPE_START,
            token: '',
            type
        };
    }
    if (formula[0] === '}') {
        if (expectSubType && expectSubType !== token_1.TokenSubType.SUBTYPE_STOP) {
            return null;
        }
        return {
            sourceToken: '}',
            subType: token_1.TokenSubType.SUBTYPE_STOP,
            token: '',
            type
        };
    }
}
