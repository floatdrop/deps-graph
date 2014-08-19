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

    it('should not add empty theme modificator', function () {
        var parent = bem('/blocks/block', { expect: {mods: {theme: 'base'}}});
        var mods = bem('/blocks/block/_theme');
        var block = bem('/index/block', { expect: {mods: {theme: 'summer'}}});

        graph.add(parent, mods, block);

        graph.deps('/index/block').should.eql([parent, block, mods]);
    });
});
