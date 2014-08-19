/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('levels', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should add blocks from parent levels', function () {
        var parent = bem('/level/block');
        var block = bem('/block');

        graph.add(parent);
        graph.add(block);

        graph.deps('/block').should.eql([parent, block]);
        graph.deps('/level/block').should.eql([parent]);
    });

    it('should throw exception only when searched in all levels', function () {
        var bummer = bem('/level/bummer');
        var block = bem('/block', { require: 'upper' });

        graph.add(bummer);
        graph.add(block);

        (function() {
            graph.deps('/block');
        }).should.throw('Not found `upper` in any levels.');
    });
});
