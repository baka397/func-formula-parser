# func-formula-parser
a AST parser for formula &amp; formula function

[![build status][travis-image]][travis-url]
[![codecov.io][codecov-image]][codecov-url]
[![node version][node-image]][node-url]

[travis-image]: https://img.shields.io/travis/baka397/func-formula-parser/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/baka397/func-formula-parser
[codecov-image]: https://img.shields.io/codecov/c/github/baka397/func-formula-parser/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/baka397/func-formula-parser?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_4-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

## 关于 About
这是一个严格验证数学公式的分析器.它帮助你进行词法分析,转化一个数学公式为`令牌(tokens)`流,还可以把令牌流进行语法分析,生成一个节点树.更多请参看[用法](#用法-usage)

This is a strict parser for formula. It will help you to parse a formula with `Lexical Analysis` & `Syntactic Analysis`. It can translate a formula string to tokens, and translate tokens to node tree. More infomation please check [Usage](#用法-usage).

## 安装 Install
```
npm i func-formula-parser --save-dev
```
## 用法 Usage

```
import FuncFormulaParser from 'func-formula-parser';
// or const FuncFormulaParser = require('func-formula-parser').default;

const formulaParser = new FuncFormulaParser({}); // option See API

const tokenList = formulaParser.setFormula('1+1'); // tokenList === formulaParser.getTokens();

console.log(tokenList);

const nodeTree = formulaParser.parseNode(); // nodeTree === formulaParser.getNodeTree();

console.log(nodeTree);

// get Error
try {
    formulaParser.setFormula('1+');
}catch(e) {
    console.error(e);
    // Print:
    // SyntaxError: Token parse Error(2:0): ""
    //    Illegal end symbol
}
```

## API

### FuncFormulaParser(option?):instance
生成一个分析器实例 Create a parse instance

- `option`: object
    - `autoParseNode`: boolean 是否自动解析语法树节点

### instance.setFormula(formula):ITokenItem[]
设置公式

- `formula`: string 公式支持多行形式,Formula support mulit line.
```
// Single line
formulaParser.setFormula('1+1');
// Mulit line
formulaParser.setFormula(`
IF(a>b,
    a,
    b
)
`);
```

### instance.parseNode():INodeItem
解析节点,如果`autoParseNode`为`true`时,则会在`setFormula`时自动执行.

If `autoParseNode` is `true`, it will autorun in `setFormula`

### instance.getTokens():ITokenItem[]
返回令牌列表 Return current tokens

### instance.getNodeTree():INodeItem
返回节点树 Return current node tree

## 构建 Build
```
npm run build
```

## 测试 Test
```
npm run unit-test
npm run cover-test
```

## 基准测试 Benchmarks
```
npm run benchmark
```
