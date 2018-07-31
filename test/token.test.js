'use strict';
const assert = require('power-assert');
const FuncFormulaParser = require('../dist/');
const formulaParser = new FuncFormulaParser({});
const TOKEN = require('../dist/types/token');

function validTokenReulst(tokenList, assertResult) {
    assert(tokenList.length === assertResult.length);
    tokenList.every(function(item, index) {
        assert(item.parentType === assertResult[index].parentType);
        assert(item.type === assertResult[index].type);
        assert(item.subType === assertResult[index].subType);
        assert(item.token === assertResult[index].token);
        assert(item.loc.row === assertResult[index].row);
        assert(item.loc.start === assertResult[index].start);
        assert(item.loc.end === assertResult[index].end);
    });
}

describe('Token', function() {
    describe('Elementary arithmetic', function() {
        it('1+1', function() {
            const tokenList = formulaParser.setFormula('1+1');
            const assertResult = [
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OPERAND,
                    subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                    token: '1',
                    row: 1,
                    start: 0,
                    end: 1
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_IN,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '+',
                    row: 1,
                    start: 1,
                    end: 2
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_IN,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '+',
                    row: 1,
                    start: 2,
                    end: 3
                }
            ];
            validTokenReulst(tokenList, assertResult);
        });
        it('(10+2)*3/5%', function() {
            const tokenList = formulaParser.setFormula('(10+2)*3/5%');
            const assertResult = [
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_SUBEXPR,
                    subType: TOKEN.TokenSubType.SUBTYPE_START,
                    token: '',
                    row: 1,
                    start: 0,
                    end: 1
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OPERAND,
                    subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                    token: '10',
                    row: 1,
                    start: 1,
                    end: 3
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_IN,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '+',
                    row: 1,
                    start: 3,
                    end: 4
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OPERAND,
                    subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                    token: '2',
                    row: 1,
                    start: 4,
                    end: 5
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_SUBEXPR,
                    subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                    token: '',
                    row: 1,
                    start: 5,
                    end: 6
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_IN,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '*',
                    row: 1,
                    start: 6,
                    end: 7
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OPERAND,
                    subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                    token: '3',
                    row: 1,
                    start: 7,
                    end: 8
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_IN,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '/',
                    row: 1,
                    start: 8,
                    end: 9
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OPERAND,
                    subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                    token: '5',
                    row: 1,
                    start: 9,
                    end: 10
                },
                {
                    parentType: null,
                    type: TOKEN.TokenType.TYPE_OP_POST,
                    subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                    token: '%',
                    row: 1,
                    start: 10,
                    end: 11
                }
            ];
            validTokenReulst(tokenList, assertResult);
        });
    });
    describe('Function', function() {
        it('IF(a>0,COUNT(3,4,5),5%)', function() {
            const tokenList = formulaParser.setFormula('IF(1>0,COUNT(3,4,5),5%)');
            assert(tokenList.length === 16);
        });
    });
});