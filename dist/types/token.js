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
    TokenType["TYPE_SPACE"] = "space";
    TokenType["TOK_TYPE_UNKNOWN"] = "unknow"; // 未知类型
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
    TokenSubType["SUBTYPE_EMPTY"] = "";
    TokenSubType["SUBTYPE_UNKNOWN"] = "unknow"; // 未知类型
})(TokenSubType = exports.TokenSubType || (exports.TokenSubType = {}));
// 子令牌类型值
exports.TokenSubTypeExpReg = {
    FUNCTION: /^([a-zA-Z_]+)\(/,
    LOGICAL: /^(>=|<=|<|>|=)/,
    MATH: /^[+\-*/^]/,
    NUMBER: /^([1-9][0-9]*|[0-9])(\.[0-9]*[1-9]|)(e[1-9][0-9]*|)/,
    POST_MATH: /^[%]/,
    PRE_MATH: /^[-]/,
    SPACE: /^\s+/,
    VARIABLE: /^[a-zA-Z_0-9\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+(?!\()/
};
