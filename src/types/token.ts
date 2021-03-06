// 令牌类型
export enum TokenType {
    TYPE_START = 'start', // 公式起始符
    TYPE_OPERAND = 'operand', // 操作对象
    TYPE_FUNCTION = 'function', // 函数
    TYPE_SUBEXPR = 'subExpression', // 子表达式
    TYPE_OP_PRE = 'operator-prefix', // 前置操作符
    TYPE_OP_IN = 'operator-infix', // 居中操作符
    TYPE_OP_POST = 'operator-postfix', // 后置表达式
    TYPE_ARGUMENT = 'argument', // 参数
    TYPE_SET = 'set', // 集合
    TYPE_SPACE = 'space', // 空格
    TYPE_COMMENT = 'comment', // 注释
    TOK_TYPE_UNKNOWN = 'unknown' // 未知类型
}

// 令牌子类型
export enum TokenSubType {
    SUBTYPE_START = 'start', // 子类型起始符
    SUBTYPE_STOP = 'stop', // 子类型结束符
    SUBTYPE_VARIABLE = 'variable', // 子类型变量
    SUBTYPE_NUMBER = 'number', // 数字类型
    SUBTYPE_STRING = 'string', // 字符串
    SUBTYPE_LOGICAL = 'logical', // 逻辑类型
    SUBTYPE_ERROR = 'error', // 错误类型
    SUBTYPE_MATH = 'math', // 数学计算符号
    SUBTYPE_EMPTY = '', // 空类型
    SUBTYPE_UNKNOWN = 'unknown' // 未知类型
}

// 子令牌类型值
export const TokenSubTypeExpReg = {
    COMMENT: /^(\/\/[^$\n]+|\/\*[^\/]+\*\/)/,
    FUNCTION: /^([a-zA-Z_]+)\(/,
    LOGICAL: /^(>=|<=|<|>|=)/,
    MATH: /^[+\-*/^]/,
    NUMBER: /^([1-9][0-9]*|[0-9])(\.[0-9]*[1-9]|)(e[1-9][0-9]*|)/,
    POST_MATH: /^[%]/,
    PRE_MATH: /^[-]/,
    SPACE: /^\s+/,
    STRING: /^(\'[^\']+\'|\"[^\"]+\")/,
    VARIABLE: /^[a-zA-Z_0-9\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+(?!\()/
};
