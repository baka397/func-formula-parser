"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./lib/token");
/**
 * 公式函数解析器
 * formula function parser
 */
var FuncFormulaParser = /** @class */ (function () {
    function FuncFormulaParser(customOpt) {
        this.option = __assign({ autoParseNode: false, customFunc: {} }, customOpt);
    }
    /**
     * 创建令牌词法分析结果
     * @param  {string}       formula 公式字符串
     * @return {ITokenItem[]}         令牌流
     */
    FuncFormulaParser.prototype.setFormula = function (formula) {
        var curFormula = formula.replace(/[\n\s]/g, '');
        if (curFormula === this.sourceFormula) {
            return this.tokenArr;
        }
        this.sourceFormula = curFormula;
        this.tokenArr = token_1.parseToken(formula);
        return this.tokenArr;
    };
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    FuncFormulaParser.prototype.getTokens = function () {
        return this.tokenArr;
    };
    return FuncFormulaParser;
}());
exports.default = FuncFormulaParser;
