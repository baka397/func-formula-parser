"use strict";
const token_1 = require("./lib/token");
/**
 * 公式函数解析器
 * formula function parser
 */
class FuncFormulaParser {
    constructor(defaultOpt) {
        this.option = Object.assign({
            autoSyntacticAnalysis: false
        }, defaultOpt);
    }
    /**
     * 创建令牌词法分析结果
     * @param  {string}       formula 公式字符串
     * @return {ITokenItem[]}         令牌流
     */
    setFormula(formula) {
        this.tokenArr = token_1.parseToken(formula);
        return this.tokenArr;
    }
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    getTokens() {
        return this.tokenArr;
    }
}
module.exports = FuncFormulaParser;
