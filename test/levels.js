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
        }).should.throw('Not found `upper` in any levels.');
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
