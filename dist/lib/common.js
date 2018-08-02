"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../types/token");
// 根据前一次token数据获取期望的token类型
function getExpectTypeByToken(prevTokenItem) {
    var expectTypeList = [];
    var curParentType = prevTokenItem.parentType;
    var curSubType = prevTokenItem.subType;
    var curType = prevTokenItem.type;
    // 对嵌入型参数插入通用类型
    function insetWrapCommonType() {
        switch (curParentType) {
            case null: // 不存在父级时
                break;
            // 如果父类型是函数或者集合时
            case token_1.TokenType.TYPE_FUNCTION:
                expectTypeList.push([token_1.TokenType.TYPE_ARGUMENT, null]);
                expectTypeList.push([token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_STOP]);
                break;
            case token_1.TokenType.TYPE_SET:
                expectTypeList.push([token_1.TokenType.TYPE_ARGUMENT, null]);
                expectTypeList.push([token_1.TokenType.TYPE_SET, token_1.TokenSubType.SUBTYPE_STOP]);
                break;
            default: // 如果父类型存在,则可以插入结束符
                expectTypeList.push([token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_STOP]);
                break;
        }
    }
    switch (curType) {
        case token_1.TokenType.TYPE_START:
            expectTypeList = [
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_OP_PRE, null],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_OPERAND, null]
            ];
            break;
        case token_1.TokenType.TYPE_OPERAND:
            expectTypeList = [
                [token_1.TokenType.TYPE_OP_IN, null],
                [token_1.TokenType.TYPE_OP_POST, null]
            ];
            insetWrapCommonType();
            break;
        case token_1.TokenType.TYPE_FUNCTION:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_SET, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_OPERAND, null]
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    expectTypeList = [
                        [token_1.TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case token_1.TokenType.TYPE_SUBEXPR:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_OP_PRE, null],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_OPERAND, null]
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    expectTypeList = [
                        [token_1.TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case token_1.TokenType.TYPE_OP_PRE:
            expectTypeList = [
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_OPERAND, null]
            ];
            break;
        case token_1.TokenType.TYPE_OP_IN:
            expectTypeList = [
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_OPERAND, null]
            ];
            break;
        case token_1.TokenType.TYPE_OP_POST:
            expectTypeList = [
                [token_1.TokenType.TYPE_OP_IN, null]
            ];
            insetWrapCommonType();
            break;
        case token_1.TokenType.TYPE_ARGUMENT:
            expectTypeList = [
                [token_1.TokenType.TYPE_OP_PRE, null],
                [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_SET, token_1.TokenSubType.SUBTYPE_START],
                [token_1.TokenType.TYPE_FUNCTION, null],
                [token_1.TokenType.TYPE_OPERAND, null]
            ];
            break;
        case token_1.TokenType.TYPE_SET:
            switch (curSubType) { // 查看起始和结束
                case token_1.TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [token_1.TokenType.TYPE_SUBEXPR, token_1.TokenSubType.SUBTYPE_START],
                        [token_1.TokenType.TYPE_OP_PRE, null],
                        [token_1.TokenType.TYPE_FUNCTION, null],
                        [token_1.TokenType.TYPE_OPERAND, null]
                    ];
                    break;
                case token_1.TokenSubType.SUBTYPE_STOP:
                    insetWrapCommonType();
                    break;
            }
            break;
    }
    return expectTypeList;
}
exports.getExpectTypeByToken = getExpectTypeByToken;
// 获取数学操作优先级
function getMathOperatorPriority(token) {
    if (token.subType === token_1.TokenSubType.SUBTYPE_LOGICAL) {
        return 1;
    }
    switch (token.token) {
        case '+':
        case '-':
            return 2;
        case '*':
        case '/':
            return 3;
        case '^':
            return 4;
        case '%':
            return 5;
    }
    return 0;
}
exports.getMathOperatorPriority = getMathOperatorPriority;
