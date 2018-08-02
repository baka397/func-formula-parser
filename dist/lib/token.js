"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../types/token");
var common_1 = require("./common");
/**
 * 解析令牌
 * @param  {string}       formula 公式字符串
 * @return {ITokenItem[]}         公式结果
 */
function parseToken(formula) {
    var formulaList = formula.split('\n');
    var curTokenItem = {
        sourceToken: '',
        subType: token_1.TokenSubType.SUBTYPE_EMPTY,
        token: '',
        type: token_1.TokenType.TYPE_START
    };
    var curTokenArray = []; // 令牌字符串
    var curParentTokenTypeList = []; // 当前父级令牌类型列表
    formulaList.forEach(function (curFormula, index) {
        curTokenArray = curTokenArray.concat(parseLineToken(curFormula, index + 1, curTokenItem, curParentTokenTypeList));
        var lastTokenItem = curTokenArray[curTokenArray.length - 1];
        // 处理节点空值的情况,返回数据
        if (lastTokenItem) {
            curTokenItem = lastTokenItem;
        }
    });
    // 检查是否没有闭合
    if (curParentTokenTypeList.length > 0) {
        throwSyntaxError(formulaList.length + 1, 0, '', "Need closure");
    }
    // 检查最后一个类型是否为闭合期望
    if (!isClosedToken(curTokenItem)) {
        throwSyntaxError(formulaList.length + 1, 0, '', "Illegal end symbol");
    }
    return curTokenArray;
}
exports.parseToken = parseToken;
function throwSyntaxError(line, col, formulaStr, desc) {
    throw new SyntaxError("Token parse Error(" + line + ":" + col + "): \"" + formulaStr + "\"\n        " + desc);
}
// 单行解析令牌
function parseLineToken(formula, line, lastTokenItem, lastParentTokenTypeList) {
    var curLineTokenList = []; // 当前数据
    var curLastTokenType = lastParentTokenTypeList[0] || null;
    // 大写并去除公式空格
    var formulaStr = formula.toUpperCase().replace(/\s/g, '');
    var curTokenItem = lastTokenItem; // 当前令牌
    var curStart = 0; // 当前起始点
    // 如果没有节点,则直接返回
    if (formulaStr.length === 0) {
        return curLineTokenList;
    }
    // 当节点结束时
    while (formulaStr.length > 0) {
        var tokenObj = parseType(formulaStr, curTokenItem);
        var tokenItem = tokenObj.item;
        if (!tokenItem) {
            throwSyntaxError(line, curStart, formulaStr, curTokenItem.type + " expect: " + tokenObj.expectTypeList.map(function (item) {
                return "" + item[0] + (item[1] ? ':' + item[1] : '');
            }).join(','));
        }
        // 更新数据
        // 更新坐标
        tokenItem.loc = {
            end: curStart + tokenItem.sourceToken.length,
            row: line,
            start: curStart
        };
        // 检测是否需要回滚到上级父令牌
        var isNeedRollback = isNeedRollbackParentToken(tokenItem);
        if (isNeedRollback) {
            lastParentTokenTypeList.shift();
        }
        // 插入当前令牌
        tokenItem.parentType = lastParentTokenTypeList[0] || null;
        // 检测是否需要插入一个新的上级令牌
        var curParentTokenType = getParentTokenTypeName(tokenItem, curLineTokenList);
        // 如果有父级类型插入
        if (curParentTokenType) {
            lastParentTokenTypeList.unshift(curParentTokenType);
        }
        curLineTokenList.push(tokenItem);
        curTokenItem = tokenItem;
        curStart = tokenItem.loc.end;
        formulaStr = formulaStr.substring(tokenItem.sourceToken.length);
    }
    return curLineTokenList;
}
/**
 * 解析起始公式
 * @param  {string}     formula 公式
 * @return {ITokenItem}         令牌对象
 */
function parseType(formula, prevTokenItem) {
    var curParentType = prevTokenItem.parentType;
    var expectTypeList = common_1.getExpectTypeByToken(prevTokenItem);
    var tokenItem = parseFormulaStr(formula, expectTypeList);
    // 如果是结束符时,设置当前类型为父类型
    if (tokenItem && tokenItem.subType === token_1.TokenSubType.SUBTYPE_STOP) {
        tokenItem.type = curParentType;
    }
    return {
        expectTypeList: expectTypeList,
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
    var tokenItem;
    var result = typeList.some(function (type) {
        var curType = type[0];
        var curExpectSubType = type[1];
        switch (curType) {
            case token_1.TokenType.TYPE_OPERAND: // 操作对象
                tokenItem = NumberTokenMatch(formula, curType);
                if (!tokenItem) {
                    tokenItem = variableTokenMatch(formula, curType);
                }
                break;
            case token_1.TokenType.TYPE_FUNCTION: // 函数
                tokenItem = functionTokenMatch(formula, curType);
                break;
            case token_1.TokenType.TYPE_SUBEXPR: // 子表达式
                tokenItem = subexpressionTokenMatch(formula, curType, curExpectSubType);
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
function getParentTokenTypeName(tokenItem, tokenList) {
    var curTokenType = tokenItem.type;
    switch (curTokenType) {
        // 以下类型会返回自身为父级令牌
        case token_1.TokenType.TYPE_FUNCTION:
        case token_1.TokenType.TYPE_SET:
        case token_1.TokenType.TYPE_SUBEXPR:
            if (tokenItem.subType === token_1.TokenSubType.SUBTYPE_STOP) {
                return null;
            }
            return curTokenType;
        default: // 非特殊的留空
            return null;
    }
}
// 是否需要回滚父级
function isNeedRollbackParentToken(tokenItem) {
    return tokenItem.subType === token_1.TokenSubType.SUBTYPE_STOP;
}
// 是否是闭合元素
function isClosedToken(tokenItem) {
    switch (tokenItem.type) {
        // 以下类型需要特殊判断
        case token_1.TokenType.TYPE_OPERAND:
        case token_1.TokenType.TYPE_SUBEXPR:
        case token_1.TokenType.TYPE_FUNCTION:
        case token_1.TokenType.TYPE_SUBEXPR:
        case token_1.TokenType.TYPE_OP_POST:
            return true;
    }
    return false;
}
/**
 * 以下为各个匹配数据类型函数
 */
// 匹配数字令牌
function NumberTokenMatch(formula, type) {
    var numberMatch = formula.match(token_1.TokenSubTypeExpReg.NUMBER);
    if (numberMatch) {
        return {
            sourceToken: numberMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_NUMBER,
            token: numberMatch[0],
            type: type
        };
    }
}
// 匹配函数令牌
function functionTokenMatch(formula, type) {
    var variableMatch = formula.match(token_1.TokenSubTypeExpReg.FUNCTION);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_START,
            token: variableMatch[1],
            type: type
        };
    }
}
// 匹配变量令牌
function variableTokenMatch(formula, type) {
    var variableMatch = formula.match(token_1.TokenSubTypeExpReg.VARIABLE);
    if (variableMatch) {
        return {
            sourceToken: variableMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_VARIABLE,
            token: variableMatch[0],
            type: type
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
            type: type
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
            type: type
        };
    }
}
// 匹配数学令牌
function mathTokenMatch(formula, type) {
    var matchExpReg;
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
    var mathMatch = formula.match(matchExpReg);
    if (mathMatch) {
        return {
            sourceToken: mathMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_MATH,
            token: mathMatch[0],
            type: type
        };
    }
}
// 匹配逻辑令牌
function logicalTokenMatch(formula, type) {
    var logicalMatch = formula.match(token_1.TokenSubTypeExpReg.LOGICAL);
    if (logicalMatch) {
        return {
            sourceToken: logicalMatch[0],
            subType: token_1.TokenSubType.SUBTYPE_LOGICAL,
            token: logicalMatch[0],
            type: type
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
            type: type
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
            type: type
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
            type: type
        };
    }
}
