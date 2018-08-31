import { IFormulaOption } from './interfaces/common';
import { INodeItem } from './interfaces/node';
import { ITokenItem } from './interfaces/token';
/**
 * 公式函数解析器
 * formula function parser
 */
declare class FuncFormulaParser {
    private option;
    private sourceFormula;
    private tokenArr;
    private nodeTree;
    constructor(customOpt?: IFormulaOption);
    /**
     * 创建令牌词法分析结果
     * @param  {string}       formula 公式字符串
     * @return {ITokenItem[]}         令牌流
     */
    public setFormula(formula: string): ITokenItem[];
    /**
     * 编译当前令牌的语法节点
     * @return {INodeItem} 语法节点树
     */
    public parseNode(): INodeItem;
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    public getTokens(): ITokenItem[];
    /**
     * 获取已经编译后的语法节点
     * @return {INodeItem} 语法节点树
     */
    public getNodeTree(): INodeItem;
}
export default FuncFormulaParser;
