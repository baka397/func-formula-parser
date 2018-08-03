import {IFormulaOption} from './interfaces/common';
import {INodeItem} from './interfaces/node';
import {ITokenItem} from './interfaces/token';

import {parseNode} from './lib/node';
import {parseToken} from './lib/token';
/**
 * 公式函数解析器
 * formula function parser
 */
class FuncFormulaParser {
    private option: IFormulaOption; // 解析器选项
    private sourceFormula: string; // 原始公式
    private tokenArr: ITokenItem[] = []; // 词法分析结果
    private nodeTree: INodeItem = null; // 语法分析结果
    constructor(customOpt: IFormulaOption = {}) {
        this.option = {
            autoParseNode: false,
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
        this.nodeTree = null; // 清空已解析的语法节点
        // 如果开启自动解析语法节点,则设置解析
        if (this.option.autoParseNode) {
            this.parseNode();
        }
        return this.tokenArr;
    }
    /**
     * 编译当前令牌的语法节点
     * @return {INodeItem} 语法节点树
     */
    public parseNode(): INodeItem {
        if (this.nodeTree) {
            return this.nodeTree;
        }
        this.nodeTree = parseNode(this.tokenArr);
        return this.nodeTree;
    }
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    public getTokens(): ITokenItem[] {
        return this.tokenArr;
    }
    /**
     * 获取已经编译后的语法节点
     * @return {INodeItem} 语法节点树
     */
    public getNodeTree(): INodeItem {
        return this.nodeTree;
    }
}

export default FuncFormulaParser;
