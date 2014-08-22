/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('graph.levels', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should search block in levels, that in parent graph', function () {
        var childGraph = new Graph(graph);

        var parent = bem('/level/block');
        graph.add(parent);

        var block = bem('/block');
        childGraph.add(block);

        childGraph.deps('/block').should.eql([parent, block]);
        childGraph.deps('/level/block').should.eql([parent]);
        graph.deps('/level/block').should.eql([parent]);
        (function () {
            graph.deps('/block');
        }).should.throw();
    });

    it('should add blocks from parent levels', function () {
        var parent = bem('/level/block');
        var block = bem('/block');

        graph.add(parent, block);

        graph.deps('/block').should.eql([parent, block]);
        graph.deps('/level/block').should.eql([parent]);
    });

    it('should throw exception only when searched in all levels', function () {
        var bummer = bem('/level/bummer');
        var block = bem('/block', { require: 'upper' });

        graph.add(bummer, block);

        (function() {
            graph.deps('/block');
        }).should.throw(new Error('Not found `/upper`\n\tfrom /block'));
    });

    it('should add modificator to current block dependencies from level expect', function () {
        var parent = bem('/blocks/block', { expect: {mods: {theme: 'base'}}});
        var modBase = bem('/blocks/block/_theme', { value: 'base'});
        var modSummer = bem('/blocks/block/_theme', { value: 'summer'});
        var block = bem('/index/block', { expect: {mods: {theme: 'summer'}}});

        graph.add(parent, modBase, modSummer, block);

        graph.deps('/index/block').should.eql([parent, block, modBase, modSummer]);
    });
});
