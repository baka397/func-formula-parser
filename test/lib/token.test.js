'use strict';
const assert = require('power-assert');
const FuncFormulaParser = require('../../src/').default;
const formulaParser = new FuncFormulaParser({});
const TOKEN = require('../../src/types/token');

function validTokenRuleList(tokenList, assertResult) {
    assert(tokenList.length === assertResult.length);
    tokenList.forEach(function(item, index) {
        assert(item.parentType === assertResult[index].parentType);
        assert(item.type === assertResult[index].type);
        assert(item.subType === assertResult[index].subType);
        assert(item.token === assertResult[index].token);
        assert(item.loc.row === assertResult[index].row);
        assert(item.loc.start === assertResult[index].start);
        assert(item.loc.end === assertResult[index].end);
        assert(item.loc.sourceStart === assertResult[index].sourceStart);
        assert(item.loc.sourceEnd === assertResult[index].sourceEnd);
    });
}

module.exports = function() {
    describe('Token', function() {
        describe('Instance Function', function() {
            it('getTokens', function() {
                const tokenList = formulaParser.setFormula('1+ 1');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 2,
                        end: 3,
                        sourceStart: 3,
                        sourceEnd: 4
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
                assert(tokenList === formulaParser.getTokens());
            });
        });
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
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 2,
                        end: 3,
                        sourceStart: 2,
                        sourceEnd: 3
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('same formula 1+1', function() {
                const tokenList = formulaParser.setFormula('1+1');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 2,
                        end: 3,
                        sourceStart: 2,
                        sourceEnd: 3
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('1+1.2', function() {
                const tokenList = formulaParser.setFormula('1+1.2');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1.2',
                        row: 1,
                        start: 2,
                        end: 5,
                        sourceStart: 2,
                        sourceEnd: 5
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('1*-1.2', function() {
                const tokenList = formulaParser.setFormula('1*-1.2');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '*',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_PRE,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '-',
                        row: 1,
                        start: 2,
                        end: 3,
                        sourceStart: 2,
                        sourceEnd: 3
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1.2',
                        row: 1,
                        start: 3,
                        end: 6,
                        sourceStart: 3,
                        sourceEnd: 6
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('1+1.2e24', function() {
                const tokenList = formulaParser.setFormula('1+1.2e24');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1.2e24',
                        row: 1,
                        start: 2,
                        end: 8,
                        sourceStart: 2,
                        sourceEnd: 8
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
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
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SUBEXPR,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '10',
                        row: 1,
                        start: 1,
                        end: 3,
                        sourceStart: 1,
                        sourceEnd: 3
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SUBEXPR,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 3,
                        end: 4,
                        sourceStart: 3,
                        sourceEnd: 4
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SUBEXPR,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '2',
                        row: 1,
                        start: 4,
                        end: 5,
                        sourceStart: 4,
                        sourceEnd: 5
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_SUBEXPR,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 5,
                        end: 6,
                        sourceStart: 5,
                        sourceEnd: 6
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '*',
                        row: 1,
                        start: 6,
                        end: 7,
                        sourceStart: 6,
                        sourceEnd: 7
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '3',
                        row: 1,
                        start: 7,
                        end: 8,
                        sourceStart: 7,
                        sourceEnd: 8
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '/',
                        row: 1,
                        start: 8,
                        end: 9,
                        sourceStart: 8,
                        sourceEnd: 9
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 1,
                        start: 9,
                        end: 10,
                        sourceStart: 9,
                        sourceEnd: 10
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_POST,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '%',
                        row: 1,
                        start: 10,
                        end: 11,
                        sourceStart: 10,
                        sourceEnd: 11
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
        });
        describe('Function', function() {
            it('Empty()', function() {
                const tokenList = formulaParser.setFormula('Empty()');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'Empty',
                        row: 1,
                        start: 0,
                        end: 6,
                        sourceStart: 0,
                        sourceEnd: 6
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 6,
                        end: 7,
                        sourceStart: 6,
                        sourceEnd: 7
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('RunString("test")+10', function() {
                const tokenList = formulaParser.setFormula('RunString("test")+10');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'RunString',
                        row: 1,
                        start: 0,
                        end: 10,
                        sourceStart: 0,
                        sourceEnd: 10
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_STRING,
                        token: 'test',
                        row: 1,
                        start: 10,
                        end: 16,
                        sourceStart: 10,
                        sourceEnd: 16
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 16,
                        end: 17,
                        sourceStart: 16,
                        sourceEnd: 17
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '+',
                        row: 1,
                        start: 17,
                        end: 18,
                        sourceStart: 17,
                        sourceEnd: 18
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '10',
                        row: 1,
                        start: 18,
                        end: 20,
                        sourceStart: 18,
                        sourceEnd: 20
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('Variable(1a测试, 2)', function() {
                const tokenList = formulaParser.setFormula('Variable(1a测试, 2)');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'Variable',
                        row: 1,
                        start: 0,
                        end: 9,
                        sourceStart: 0,
                        sourceEnd: 9
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: '1a测试',
                        row: 1,
                        start: 9,
                        end: 13,
                        sourceStart: 9,
                        sourceEnd: 13
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 13,
                        end: 14,
                        sourceStart: 13,
                        sourceEnd: 14
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '2',
                        row: 1,
                        start: 14,
                        end: 15,
                        sourceStart: 15,
                        sourceEnd: 16
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 15,
                        end: 16,
                        sourceStart: 16,
                        sourceEnd: 17
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('Round(-1, -5%)', function() {
                const tokenList = formulaParser.setFormula('Round(-1, -5%)');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'Round',
                        row: 1,
                        start: 0,
                        end: 6,
                        sourceStart: 0,
                        sourceEnd: 6
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_PRE,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '-',
                        row: 1,
                        start: 6,
                        end: 7,
                        sourceStart: 6,
                        sourceEnd: 7
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '1',
                        row: 1,
                        start: 7,
                        end: 8,
                        sourceStart: 7,
                        sourceEnd: 8
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 8,
                        end: 9,
                        sourceStart: 8,
                        sourceEnd: 9
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_PRE,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '-',
                        row: 1,
                        start: 9,
                        end: 10,
                        sourceStart: 10,
                        sourceEnd: 11
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 1,
                        start: 10,
                        end: 11,
                        sourceStart: 11,
                        sourceEnd: 12
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_POST,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '%',
                        row: 1,
                        start: 11,
                        end: 12,
                        sourceStart: 12,
                        sourceEnd: 13
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 12,
                        end: 13,
                        sourceStart: 13,
                        sourceEnd: 14
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('IF(a>=0,count(3,4,5),5%)', function() {
                const tokenList = formulaParser.setFormula('IF(a>=0,count(3,4,5),5%)');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'IF',
                        row: 1,
                        start: 0,
                        end: 3,
                        sourceStart: 0,
                        sourceEnd: 3
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: 'a',
                        row: 1,
                        start: 3,
                        end: 4,
                        sourceStart: 3,
                        sourceEnd: 4
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_LOGICAL,
                        token: '>=',
                        row: 1,
                        start: 4,
                        end: 6,
                        sourceStart: 4,
                        sourceEnd: 6
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '0',
                        row: 1,
                        start: 6,
                        end: 7,
                        sourceStart: 6,
                        sourceEnd: 7
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 7,
                        end: 8,
                        sourceStart: 7,
                        sourceEnd: 8
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'count',
                        row: 1,
                        start: 8,
                        end: 14,
                        sourceStart: 8,
                        sourceEnd: 14
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '3',
                        row: 1,
                        start: 14,
                        end: 15,
                        sourceStart: 14,
                        sourceEnd: 15
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 15,
                        end: 16,
                        sourceStart: 15,
                        sourceEnd: 16
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '4',
                        row: 1,
                        start: 16,
                        end: 17,
                        sourceStart: 16,
                        sourceEnd: 17
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 17,
                        end: 18,
                        sourceStart: 17,
                        sourceEnd: 18
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 1,
                        start: 18,
                        end: 19,
                        sourceStart: 18,
                        sourceEnd: 19
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 19,
                        end: 20,
                        sourceStart: 19,
                        sourceEnd: 20
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 20,
                        end: 21,
                        sourceStart: 20,
                        sourceEnd: 21
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 1,
                        start: 21,
                        end: 22,
                        sourceStart: 21,
                        sourceEnd: 22
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_POST,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '%',
                        row: 1,
                        start: 22,
                        end: 23,
                        sourceStart: 22,
                        sourceEnd: 23
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 23,
                        end: 24,
                        sourceStart: 23,
                        sourceEnd: 24
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('CONTAINS({test,10,测试})', function() {
                const tokenList = formulaParser.setFormula('CONTAINS({test,10,测试})');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'CONTAINS',
                        row: 1,
                        start: 0,
                        end: 9,
                        sourceStart: 0,
                        sourceEnd: 9
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_SET,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: '',
                        row: 1,
                        start: 9,
                        end: 10,
                        sourceStart: 9,
                        sourceEnd: 10
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SET,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: 'test',
                        row: 1,
                        start: 10,
                        end: 14,
                        sourceStart: 10,
                        sourceEnd: 14
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SET,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 14,
                        end: 15,
                        sourceStart: 14,
                        sourceEnd: 15
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SET,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '10',
                        row: 1,
                        start: 15,
                        end: 17,
                        sourceStart: 15,
                        sourceEnd: 17
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SET,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 1,
                        start: 17,
                        end: 18,
                        sourceStart: 17,
                        sourceEnd: 18
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_SET,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: '测试',
                        row: 1,
                        start: 18,
                        end: 20,
                        sourceStart: 18,
                        sourceEnd: 20
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_SET,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 20,
                        end: 21,
                        sourceStart: 20,
                        sourceEnd: 21
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 1,
                        start: 21,
                        end: 22,
                        sourceStart: 21,
                        sourceEnd: 22
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
        });
        describe('Format function', function() {
            it('\n--------------// test comment\n/** test inline comment */ IF(a /** in formula comment */>= 0,// test end comment\n    count(3, 4, 5),\n-5%)\n--------------\n', function() {
                const tokenList = formulaParser.setFormula('// test comment\n/** test inline comment */ IF(a /** in formula comment */>= 0,// test end comment\n    count(3, 4, 5),\n-5%)\n');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'IF',
                        row: 2,
                        start: 0,
                        end: 3,
                        sourceStart: 27,
                        sourceEnd: 30
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: 'a',
                        row: 2,
                        start: 3,
                        end: 4,
                        sourceStart: 30,
                        sourceEnd: 31
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_LOGICAL,
                        token: '>=',
                        row: 2,
                        start: 4,
                        end: 6,
                        sourceStart: 57,
                        sourceEnd: 59,
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '0',
                        row: 2,
                        start: 6,
                        end: 7,
                        sourceStart: 60,
                        sourceEnd: 61
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 2,
                        start: 7,
                        end: 8,
                        sourceStart: 61,
                        sourceEnd: 62
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'count',
                        row: 3,
                        start: 0,
                        end: 6,
                        sourceStart: 4,
                        sourceEnd: 10
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '3',
                        row: 3,
                        start: 6,
                        end: 7,
                        sourceStart: 10,
                        sourceEnd: 11
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 7,
                        end: 8,
                        sourceStart: 11,
                        sourceEnd: 12
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '4',
                        row: 3,
                        start: 8,
                        end: 9,
                        sourceStart: 13,
                        sourceEnd: 14
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 9,
                        end: 10,
                        sourceStart: 14,
                        sourceEnd: 15
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 3,
                        start: 10,
                        end: 11,
                        sourceStart: 16,
                        sourceEnd: 17
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 3,
                        start: 11,
                        end: 12,
                        sourceStart: 17,
                        sourceEnd: 18
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 12,
                        end: 13,
                        sourceStart: 18,
                        sourceEnd: 19
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_PRE,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '-',
                        row: 4,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 4,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_POST,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '%',
                        row: 4,
                        start: 2,
                        end: 3,
                        sourceStart: 2,
                        sourceEnd: 3
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 4,
                        start: 3,
                        end: 4,
                        sourceStart: 3,
                        sourceEnd: 4
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
            it('\n--------------\nIF(a >= 0,\n    count(3, 4, 5),\n-5%)\n--------------\n', function() {
                const tokenList = formulaParser.setFormula('\nIF(a >= 0,\n    count(3, 4, 5),\n-5%)\n');
                const assertResult = [
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'IF',
                        row: 2,
                        start: 0,
                        end: 3,
                        sourceStart: 0,
                        sourceEnd: 3
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_VARIABLE,
                        token: 'a',
                        row: 2,
                        start: 3,
                        end: 4,
                        sourceStart: 3,
                        sourceEnd: 4
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_IN,
                        subType: TOKEN.TokenSubType.SUBTYPE_LOGICAL,
                        token: '>=',
                        row: 2,
                        start: 4,
                        end: 6,
                        sourceStart: 5,
                        sourceEnd: 7
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '0',
                        row: 2,
                        start: 6,
                        end: 7,
                        sourceStart: 8,
                        sourceEnd: 9
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 2,
                        start: 7,
                        end: 8,
                        sourceStart: 9,
                        sourceEnd: 10
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_START,
                        token: 'count',
                        row: 3,
                        start: 0,
                        end: 6,
                        sourceStart: 4,
                        sourceEnd: 10
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '3',
                        row: 3,
                        start: 6,
                        end: 7,
                        sourceStart: 10,
                        sourceEnd: 11
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 7,
                        end: 8,
                        sourceStart: 11,
                        sourceEnd: 12
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '4',
                        row: 3,
                        start: 8,
                        end: 9,
                        sourceStart: 13,
                        sourceEnd: 14
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 9,
                        end: 10,
                        sourceStart: 14,
                        sourceEnd: 15
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 3,
                        start: 10,
                        end: 11,
                        sourceStart: 16,
                        sourceEnd: 17
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 3,
                        start: 11,
                        end: 12,
                        sourceStart: 17,
                        sourceEnd: 18
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_ARGUMENT,
                        subType: TOKEN.TokenSubType.SUBTYPE_EMPTY,
                        token: '',
                        row: 3,
                        start: 12,
                        end: 13,
                        sourceStart: 18,
                        sourceEnd: 19
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_PRE,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '-',
                        row: 4,
                        start: 0,
                        end: 1,
                        sourceStart: 0,
                        sourceEnd: 1
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OPERAND,
                        subType: TOKEN.TokenSubType.SUBTYPE_NUMBER,
                        token: '5',
                        row: 4,
                        start: 1,
                        end: 2,
                        sourceStart: 1,
                        sourceEnd: 2
                    },
                    {
                        parentType: TOKEN.TokenType.TYPE_FUNCTION,
                        type: TOKEN.TokenType.TYPE_OP_POST,
                        subType: TOKEN.TokenSubType.SUBTYPE_MATH,
                        token: '%',
                        row: 4,
                        start: 2,
                        end: 3,
                        sourceStart: 2,
                        sourceEnd: 3
                    },
                    {
                        parentType: null,
                        type: TOKEN.TokenType.TYPE_FUNCTION,
                        subType: TOKEN.TokenSubType.SUBTYPE_STOP,
                        token: '',
                        row: 4,
                        start: 3,
                        end: 4,
                        sourceStart: 3,
                        sourceEnd: 4
                    }
                ];
                validTokenRuleList(tokenList, assertResult);
            });
        });
        describe('Error Test', function() {
            it('IF(a>=0,)', function() {
                try {
                    formulaParser.setFormula('IF(a>=0,)');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf('expect:') >= 0);
                }
            });
            it('(IF(a>=0)', function() {
                try {
                    formulaParser.setFormula('(IF(a>=0)');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf('Need closure') >= 0);
                }
            });
            it('a+', function() {
                try {
                    formulaParser.setFormula('a+');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf('Illegal end symbol') >= 0);
                }
            });
            it('(a*10(', function() {
                try {
                    formulaParser.setFormula('(a*10(');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf(`${TOKEN.TokenType.TYPE_SUBEXPR}:${TOKEN.TokenSubType.SUBTYPE_STOP}`) >= 0);
                }
            });
            it('IF(})', function() {
                try {
                    formulaParser.setFormula('IF(})');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf(`${TOKEN.TokenType.TYPE_SET}:${TOKEN.TokenSubType.SUBTYPE_START}`) >= 0);
                }
            });
            it('IF({10{)', function() {
                try {
                    formulaParser.setFormula('IF({10{)');
                    throw new Error('Unreachable Code');
                } catch(e) {
                    assert(e instanceof SyntaxError);
                    assert(e.message.indexOf(`${TOKEN.TokenType.TYPE_SET}:${TOKEN.TokenSubType.SUBTYPE_STOP}`) >= 0);
                }
            });
        });
    });
};