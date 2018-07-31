'use strict';
/*eslint no-console: ["error", { allow: ["log"] }] */
const Benchmark = require('benchmark');
const simpleSuite = new Benchmark.Suite('simple');
const complexSuite = new Benchmark.Suite('complex');

const chalk = require('chalk');

const FuncFormulaParser = require('../../dist/');
const excelFormulaP = require('../third_lib/excel_formula_p');
const simpleFormula = '1+1';
const complexFormula = 'IF(1>0,COUNT(3,4,5),5%)';

console.log(chalk.bgYellow('Start benchmark'));

console.log(chalk.yellow(`\n1. Simple Formula: ${simpleFormula}\n`));

// 添加FuncFormulaParser测试用例
simpleSuite
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

console.log(chalk.yellow(`\n2. Complex Formula: ${complexFormula}\n`));
// 添加FuncFormulaParser测试用例
complexSuite
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