import {IFormulaOption} from './interfaces/common';
import {ITokenItem} from './interfaces/token';

import {parseToken} from './lib/token';
/**
 * 公式函数解析器
 * formula function parser
 */
class FuncFormulaParser {
    private option: IFormulaOption; // 解析器选项
    private tokenArr: ITokenItem[]; // 词法分析结果
    private sourceFormula: string; // 原始公式
    constructor(customOpt?: IFormulaOption) {
        this.option = {
            autoParseNode: false,
            customFunc: {},
            ...customOpt
        };
    }
    /**
     * 创建令牌词法分析结果
     * @param  {string}       formula 公式字符串
     * @return {ITokenItem[]}         令牌流
     */
    public setFormula(formula: string): ITokenItem[] {
        const curFormula = formula.replace(/[\n\s]/g, '');
        if (curFormula === this.sourceFormula) {
            return this.tokenArr;
        }
        this.sourceFormula = curFormula;
        this.tokenArr = parseToken(formula);
        return this.tokenArr;
    }
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    public getTokens(): ITokenItem[] {
        return this.tokenArr;
    }
}

export default FuncFormulaParser;
