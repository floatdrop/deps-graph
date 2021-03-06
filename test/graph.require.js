/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('graph.require', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should add required block', function () {
        var required = bem('/required');
        var block = bem('/block', {}, { require: [required] });

        graph.add(required, block);

        graph.deps(block).should.eql([required, block]);
        graph.deps(required).should.eql([required]);
    });

    it('should add required blocks from levels', function () {
        var required = bem('/level/required');
        var parent = bem('/level/block', {}, { require: [required] });
        var block = bem('/block');

        graph.add(required, parent, block);

        graph.deps(block).should.eql([required, parent, block]);
        graph.deps(parent).should.eql([required, parent]);
    });

    it('should search required blocks in levels', function () {
        var required = bem('/level/required');
        var block = bem('/block', {}, { require: [required] });

        graph.add(required, block);

        graph.deps(block).should.eql([required, block]);
    });
});
