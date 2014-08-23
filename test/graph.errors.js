/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('graph.errors', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should format errors', function () {
        var block = bem('/level/block', {}, { require: [bem('/level/block__elem')]});
        graph.add(block);

        (function () {
            graph.deps(bem('/level/block'));
        }).should.throw(new Error('Not found `/level/block__elem`\n\tfrom /level/block'));
    });
});
