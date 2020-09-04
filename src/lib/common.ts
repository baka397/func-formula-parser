import {ITokenItem} from '../interfaces/token';

import {ExpectType} from '../types/common';
import {TokenSubType, TokenType} from '../types/token';

// 根据前一次token数据获取期望的token类型
export function getExpectTypeByToken(prevTokenItem: ITokenItem): ExpectType[] {
    let expectTypeList: ExpectType[] = [];
    const curParentType: TokenType | undefined = prevTokenItem.parentType;
    const curSubType: TokenSubType = prevTokenItem.subType;
    const curType: TokenType = prevTokenItem.type;
    // 对嵌入型参数插入通用类型
    function insetWrapCommonType() {
        switch (curParentType) {
            case null: // 不存在父级时
                break;
            // 如果父类型是函数或者集合时
            case TokenType.TYPE_FUNCTION:
                expectTypeList.push([TokenType.TYPE_ARGUMENT, null]);
                expectTypeList.push([TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_STOP]);
                break;
            case TokenType.TYPE_SET:
                expectTypeList.push([TokenType.TYPE_ARGUMENT, null]);
                expectTypeList.push([TokenType.TYPE_SET, TokenSubType.SUBTYPE_STOP]);
                break;
            default: // 如果父类型存在,则可以插入结束符
                expectTypeList.push([TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_STOP]);
                break;
        }
    }
    switch (curType) {
        case TokenType.TYPE_START:
            expectTypeList = [
                [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                [TokenType.TYPE_OP_PRE, null],
                [TokenType.TYPE_FUNCTION, null],
                [TokenType.TYPE_OPERAND, null]
            ];
            break;
        case TokenType.TYPE_OPERAND:
            switch (curSubType) {
                case TokenSubType.SUBTYPE_STRING:
                    break;
                default:
                    expectTypeList = [
                        [TokenType.TYPE_OP_IN, null],
                        [TokenType.TYPE_OP_POST, null]
                    ];
            }
            insetWrapCommonType();
            break;
        case TokenType.TYPE_FUNCTION:
            switch (curSubType) { // 查看起始和结束
                case TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_STOP], // 函数结束符,空函数
                        [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START], // 子表达式
                        [TokenType.TYPE_SET, TokenSubType.SUBTYPE_START], // 集合起始
                        [TokenType.TYPE_FUNCTION, null],
                        [TokenType.TYPE_OPERAND, TokenSubType.SUBTYPE_STRING],
                        [TokenType.TYPE_OPERAND, null],
                        [TokenType.TYPE_OP_PRE, null]
                    ];
                    break;
                case TokenSubType.SUBTYPE_STOP:
                    expectTypeList = [
                        [TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case TokenType.TYPE_SUBEXPR:
            switch (curSubType) { // 查看起始和结束
                case TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                        [TokenType.TYPE_OP_PRE, null],
                        [TokenType.TYPE_FUNCTION, null],
                        [TokenType.TYPE_OPERAND, null]
                    ];
                    break;
                case TokenSubType.SUBTYPE_STOP:
                    expectTypeList = [
                        [TokenType.TYPE_OP_IN, null]
                    ];
                    insetWrapCommonType();
                    break;
            }
            break;
        case TokenType.TYPE_OP_PRE:
            expectTypeList = [
                [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                [TokenType.TYPE_FUNCTION, null],
                [TokenType.TYPE_OPERAND, null]
            ];
            break;
        case TokenType.TYPE_OP_IN:
            expectTypeList = [
                [TokenType.TYPE_OP_PRE, null],
                [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                [TokenType.TYPE_FUNCTION, null],
                [TokenType.TYPE_OPERAND, null]
            ];
            break;
        case TokenType.TYPE_OP_POST:
            expectTypeList = [
                [TokenType.TYPE_OP_IN, null]
            ];
            insetWrapCommonType();
            break;
        case TokenType.TYPE_ARGUMENT:
            expectTypeList = [
                [TokenType.TYPE_OP_PRE, null],
                [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                [TokenType.TYPE_SET, TokenSubType.SUBTYPE_START],
                [TokenType.TYPE_FUNCTION, null],
                [TokenType.TYPE_OPERAND, TokenSubType.SUBTYPE_STRING],
                [TokenType.TYPE_OPERAND, null]
            ];
            break;
        case TokenType.TYPE_SET:
            switch (curSubType) { // 查看起始和结束
                case TokenSubType.SUBTYPE_START:
                    expectTypeList = [
                        [TokenType.TYPE_SUBEXPR, TokenSubType.SUBTYPE_START],
                        [TokenType.TYPE_OP_PRE, null],
                        [TokenType.TYPE_FUNCTION, null],
                        [TokenType.TYPE_OPERAND, null]
                    ];
                    break;
                case TokenSubType.SUBTYPE_STOP:
                    insetWrapCommonType();
                    break;
            }
            break;
    }
    return expectTypeList;
}

// 获取数学操作优先级
export function getMathOperatorPriority(token: ITokenItem): number {
    if (token.subType === TokenSubType.SUBTYPE_LOGICAL) {
        return 1;
    }
    switch (token.token) {
        case '+':
            return 1;
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
