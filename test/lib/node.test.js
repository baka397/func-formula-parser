'use strict';
const assert = require('power-assert');
const FuncFormulaParser = require('../../dist/').default;
const formulaParser = new FuncFormulaParser({
    autoParseNode: true
});

function validTokenReulst(nodeTree, assertNodeTree) {
    assert(nodeTree);
    assert(assertNodeTree);
    assert(nodeTree.token.token === assertNodeTree.token);
    assert(nodeTree.children.length === (assertNodeTree.children || []).length);
    nodeTree.children.forEach(function(curNode, index) {
        validTokenReulst(curNode, assertNodeTree.children[index]);
    });
}

module.exports = function() {
    describe('Node', function() {
        describe('Elementary arithmetic', function() {
            it('1+2', function() {
                formulaParser.setFormula('1+2');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: '1'
                        },
                        {
                            token: '2'
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
            it('2+1*3', function() {
                formulaParser.setFormula('2+1*3');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: '2'
                        },
                        {
                            token: '*',
                            children: [
                                {
                                    token: '1'
                                },
                                {
                                    token: '3'
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
            it('2*3^2', function() {
                formulaParser.setFormula('2*3^2');
                const assertNodeTree = {
                    token: '*',
                    children: [
                        {
                            token: '2'
                        },
                        {
                            token: '^',
                            children: [
                                {
                                    token: '3'
                                },
                                {
                                    token: '2'
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
            it('2*(1+2)^2', function() {
                formulaParser.setFormula('2*(1+2)^2');
                const assertNodeTree = {
                    token: '*',
                    children: [
                        {
                            token: '2'
                        },
                        {
                            token: '^',
                            children: [
                                {
                                    token: '',
                                    children: [
                                        {
                                            token: '+',
                                            children: [
                                                {
                                                    token: '1'
                                                },
                                                {
                                                    token: '2'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    token: '2'
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
        });
    });
};