/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('graph.expect', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should add expected block', function () {
        var expected = bem('/expected');
        var block = bem('/block', {}, { expect: expected });

        graph.add(expected, block);

        graph.deps(block).should.eql([block, expected]);
        graph.deps(expected).should.eql([expected]);
    });

    it('should add expected blocks from levels', function () {
        var expected = bem('/level/expected');
        var parent = bem('/level/block', {}, { expect: expected });
        var block = bem('/block');

        graph.add(expected, parent, block);

        graph.deps(block).should.eql([parent, block, expected]);
        graph.deps(parent).should.eql([parent, expected]);
    });

    it('should search expected blocks in levels', function () {
        var expected = bem('/level/expected');
        var block = bem('/block', {}, { expect: bem('/expected') });

        graph.add(expected, block);

        graph.deps(block).should.eql([block, expected]);
    });
});
