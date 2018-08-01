"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 令牌类型
var TokenType;
(function (TokenType) {
    TokenType["TYPE_START"] = "start";
    TokenType["TYPE_OPERAND"] = "operand";
    TokenType["TYPE_FUNCTION"] = "function";
    TokenType["TYPE_SUBEXPR"] = "subexpression";
    TokenType["TYPE_OP_PRE"] = "operator-prefix";
    TokenType["TYPE_OP_IN"] = "operator-infix";
    TokenType["TYPE_OP_POST"] = "operator-postfix";
    TokenType["TYPE_ARGUMENT"] = "argument";
    TokenType["TYPE_SET"] = "set";
    TokenType["TYPE_VARIABLE"] = "variable";
    TokenType["TOK_TYPE_UNKNOWN"] = "unknow"; // 未知语句
})(TokenType = exports.TokenType || (exports.TokenType = {}));
// 令牌子类型
var TokenSubType;
(function (TokenSubType) {
    TokenSubType["SUBTYPE_START"] = "start";
    TokenSubType["SUBTYPE_STOP"] = "stop";
    TokenSubType["SUBTYPE_VARIABLE"] = "variable";
    TokenSubType["SUBTYPE_NUMBER"] = "number";
    TokenSubType["SUBTYPE_LOGICAL"] = "logical";
    TokenSubType["SUBTYPE_ERROR"] = "error";
    TokenSubType["SUBTYPE_MATH"] = "math";
    TokenSubType["SUBTYPE_EMPTY"] = ""; // 空类型
})(TokenSubType = exports.TokenSubType || (exports.TokenSubType = {}));
// 子令牌类型值
exports.TokenSubTypeExpReg = {
    FUNCTION: /^([A-Z_]+)\(/,
    LOGICAL: /^(>=|<=|<|>|=)/,
    MATH: /^[+\-*/]/,
    NUMBER: /^([1-9][0-9]*|[0-9])(|\.[0-9]*[1-9])/,
    POST_MATH: /^[%]/,
    PRE_MATH: /^[-]/,
    VARIABLE: /^[A-Z_\u4e00-\u9fa5]+/
};