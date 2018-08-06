'use strict';
const tokenTest = require('./lib/token.test');
const nodeTest = require('./lib/node.test');

describe('Parse', function() {
    tokenTest();
    nodeTest();
});