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
var node_1 = require("./lib/node");
var token_1 = require("./lib/token");
/**
 * 公式函数解析器
 * formula function parser
 */
var FuncFormulaParser = /** @class */ (function () {
    function FuncFormulaParser(customOpt) {
        if (customOpt === void 0) { customOpt = {}; }
        this.tokenArr = []; // 词法分析结果
        this.nodeTree = null; // 语法分析结果
        this.option = __assign({ autoParseNode: false }, customOpt);
    }
    /**
     * 创建令牌词法分析结果
     * @param  {string}       formula 公式字符串
     * @return {ITokenItem[]}         令牌流
     */
    FuncFormulaParser.prototype.setFormula = function (formula) {
        var curFormula = formula.replace(/[\n]/g, '');
        if (curFormula === this.sourceFormula) {
            return this.tokenArr;
        }
        this.sourceFormula = curFormula;
        this.tokenArr = token_1.parseToken(formula);
        this.nodeTree = null; // 清空已解析的语法节点
        // 如果开启自动解析语法节点,则设置解析
        if (this.option.autoParseNode) {
            this.parseNode();
        }
        return this.tokenArr;
    };
    /**
     * 编译当前令牌的语法节点
     * @return {INodeItem} 语法节点树
     */
    FuncFormulaParser.prototype.parseNode = function () {
        if (this.nodeTree) {
            return this.nodeTree;
        }
        this.nodeTree = node_1.parseNode(this.tokenArr);
        return this.nodeTree;
    };
    /**
     * 获取令牌词法分析结果
     * @return {ITokenItem[]} 令牌流
     */
    FuncFormulaParser.prototype.getTokens = function () {
        return this.tokenArr;
    };
    /**
     * 获取已经编译后的语法节点
     * @return {INodeItem} 语法节点树
     */
    FuncFormulaParser.prototype.getNodeTree = function () {
        return this.nodeTree;
    };
    return FuncFormulaParser;
}());
exports.default = FuncFormulaParser;
