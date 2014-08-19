/* global describe, it, beforeEach */
var Graph = require('../index.js');
var bem = require('bem-object').fromPath;
require('should');

describe('graph', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should throw exception for not existing path', function () {
        (function() {
            graph.deps('undefined');
        }).should.throw('BEM object with path `undefined` not found');
    });

    it('should return simple block', function () {
        var block = bem('/block');
        graph.add(block);

        graph.deps('/block').should.eql([block]);
    });
});
