'use strict';
const assert = require('power-assert');
const FuncFormulaParser = require('../../src/').default;
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
        describe('Instance Function', function() {
            it('parseNode', function() {
                const unautoformulaParser = new FuncFormulaParser();
                unautoformulaParser.setFormula('1+2');
                const nodeTree = unautoformulaParser.parseNode();
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
                validTokenReulst(nodeTree, assertNodeTree);
                assert(nodeTree === unautoformulaParser.getNodeTree());
            });
            it('parseNode with already formula', function() {
                const autoformulaParser = new FuncFormulaParser({
                    autoParseNode: true
                });
                autoformulaParser.setFormula('1+2');
                const nodeTree = autoformulaParser.parseNode();
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
                validTokenReulst(nodeTree, assertNodeTree);
                assert(nodeTree === autoformulaParser.parseNode());
            });
        });
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
            it('same formula 1+2', function() {
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
            it('-2+(1+2)*2', function() {
                formulaParser.setFormula('-2+(1+2)*2');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: '-',
                            children: [
                                {
                                    token: '2'
                                }
                            ]
                        },
                        {
                            token: '*',
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
            it('-2+(1+2)*-25%', function() {
                formulaParser.setFormula('-2+(1+2)*-25%');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: '-',
                            children: [
                                {
                                    token: '2'
                                }
                            ]
                        },
                        {
                            token: '*',
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
                                    token: '-',
                                    children: [
                                        {
                                            token: '%',
                                            children: [
                                                {
                                                    token: '25'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
        });
        describe('Function', function() {
            it('100 + IF( CaseContentNonnull(), CaseAmount(测试), 2 ) + RoundUp( CaseContentCountIntersection({1, 2}) * 0.1, 1 ) + CaseContentCountOption(1)', function() {
                formulaParser.setFormula('100 + IF( CaseContentNonnull(), CaseAmount(测试), 2 ) + RoundUp( CaseContentCountIntersection({1, 2}) * 0.1, 1 ) + CaseContentCountOption(1)');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: '100'
                        },
                        {
                            token: '+',
                            children: [
                                {
                                    token: 'IF',
                                    children: [
                                        {
                                            token: 'CaseContentNonnull'
                                        },
                                        {
                                            token: 'CaseAmount',
                                            children: [
                                                {
                                                    token: '测试'
                                                }
                                            ]
                                        },
                                        {
                                            token: '2'
                                        }
                                    ]
                                },
                                {
                                    token: '+',
                                    children: [
                                        {
                                            token: 'RoundUp',
                                            children: [
                                                {
                                                    token: '*',
                                                    children: [
                                                        {
                                                            token: 'CaseContentCountIntersection',
                                                            children: [
                                                                {
                                                                    token: '', // set
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
                                                            token: '0.1'
                                                        }
                                                    ]
                                                },
                                                {
                                                    token: '1'
                                                }
                                            ]
                                        },
                                        {
                                            token: 'CaseContentCountOption',
                                            children: [
                                                {
                                                    token: '1'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
            it('IF(a>=0,-count(3,4,5),5%)', function() {
                formulaParser.setFormula('IF(a>=0,-count(3,4,5),5%)');
                const assertNodeTree = {
                    token: 'IF',
                    children: [
                        {
                            token: '>=',
                            children: [
                                {
                                    token: 'a'
                                },
                                {
                                    token: '0'
                                }
                            ]
                        },
                        {
                            token: '-',
                            children: [
                                {
                                    token: 'count',
                                    children: [
                                        {
                                            token: '3'
                                        },
                                        {
                                            token: '4'
                                        },
                                        {
                                            token: '5'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            token: '%',
                            children: [
                                {
                                    token: '5'
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
            it('count(a) + IF(CONTAINS({3, 4, 5}), POW(2,b), ROUND(a*2.3,b))', function() {
                formulaParser.setFormula('count(a) + IF(CONTAINS({3, 4, 5}), POW(2,b), ROUND(a*2.3,b))');
                const assertNodeTree = {
                    token: '+',
                    children: [
                        {
                            token: 'count',
                            children: [
                                {
                                    token: 'a'
                                }
                            ]
                        },
                        {
                            token: 'IF',
                            children: [
                                {
                                    token: 'CONTAINS',
                                    children: [
                                        {
                                            token: '', // set
                                            children: [
                                                {
                                                    token: '3'
                                                },
                                                {
                                                    token: '4'
                                                },
                                                {
                                                    token: '5'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    token: 'POW',
                                    children: [
                                        {
                                            token: '2'
                                        },
                                        {
                                            token: 'b'
                                        }
                                    ]
                                },
                                {
                                    token: 'ROUND',
                                    children: [
                                        {
                                            token: '*',
                                            children: [
                                                {
                                                    token: 'a'
                                                },
                                                {
                                                    token: '2.3'
                                                }
                                            ]
                                        },
                                        {
                                            token: 'b'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                validTokenReulst(formulaParser.getNodeTree(), assertNodeTree);
            });
        });
        describe('Error Test', function() {
            it('Empty', function() {
                const emptyFormulaParser = new FuncFormulaParser({
                    autoParseNode: true
                });
                assert(emptyFormulaParser.parseNode() === null);
            });
        });
    });
};