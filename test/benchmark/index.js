'use strict';
/*eslint no-console: ["error", { allow: ["log"] }] */
const Benchmark = require('benchmark');

const chalk = require('chalk');

const FuncFormulaParser = require('../../dist/').default;
const excelFormulaP = require('../third_lib/excel_formula_p');
const simpleFormula = '1+1';
const complexFormula = 'count(a) + IF(CONTAINS({3, 4, 5}), POW(2,b), ROUND(a*2.3))';

// 词法分析测试
// 简单公式测试
console.log(chalk.bgYellow('Start "Lexical Analysis" benchmark'));
console.log(chalk.yellow(`\n1. Simple Formula: ${simpleFormula}\n`));
new Benchmark.Suite('simple')
    .add('FuncFormulaParser#setFormula', function() {
        const formulaParser = new FuncFormulaParser({});
        formulaParser.setFormula(simpleFormula);
    })
    .add('excelFormulaP#getTokens', function() {
        excelFormulaP.getTokens(simpleFormula);
    })
    // add listeners
    .on('cycle', function(event) {
        console.log(chalk.white(String(event.target)));
    })
    .on('complete', function() {
        console.log(chalk.green('Fastest is ' + this.filter('fastest').map('name')));
    })
    .run();

// 复杂公式测试
console.log(chalk.yellow(`\n2. Complex Formula: ${complexFormula}\n`));
new Benchmark.Suite('complex')
    .add('FuncFormulaParser#setFormula', function() {
        const formulaParser = new FuncFormulaParser({});
        formulaParser.setFormula(complexFormula);
    })
    .add('excelFormulaP#getTokens', function() {
        excelFormulaP.getTokens(complexFormula);
    })
    // add listeners
    .on('cycle', function(event) {
        console.log(chalk.white(String(event.target)));
    })
    .on('complete', function() {
        console.log(chalk.green('Fastest is ' + this.filter('fastest').map('name')));
    })
    .run();

// 混合流程测试
console.log(chalk.bgYellow('\nStart "Lexical Analysis" & "Syntactic Analysis" benchmark\n'));

// 简单公式测试
console.log(chalk.yellow(`\n1. Simple Formula: ${simpleFormula}\n`));
new Benchmark('simple', function() {
    const formulaParser = new FuncFormulaParser({
        autoParseNode: true
    });
    formulaParser.setFormula(simpleFormula);
})
    // add listeners
    .on('complete', function(event) {
        console.log(chalk.green(String(event.target)));
    })
    .run();

// 复杂公式测试
console.log(chalk.yellow(`\n2. Complex Formula: ${complexFormula}\n`));
new Benchmark('complex', function() {
    const formulaParser = new FuncFormulaParser({
        autoParseNode: true
    });
    formulaParser.setFormula(complexFormula);
})
    // add listeners
    .on('complete', function(event) {
        console.log(chalk.green(String(event.target)));
    })
    .run();