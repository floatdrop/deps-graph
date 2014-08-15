/* global describe, it, beforeEach */

var Graph = require('../index.js');
var should = require('should');
var bemObject = require('bem-object');

describe('Graph', function () {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    it('should throw exception for non existed BEM object', function () {
        (function() {
            graph.deps('undefined');
        }).should.throw('BEM object with path `undefined` not found');
    });

    it('should create deps array with only one BEM object', function () {
        var block = bemObject.fromPath('/block');
        graph.add(block);

        graph.deps('/block').should.eql([block]);
    });

    it('should create deps array with two BEM objects with one require another', function () {
        var independent = bemObject.fromPath('/independent');
        var dependent = bemObject.fromPath('/dependent', { require: { block: 'independent' }});

        graph.add(independent);
        graph.add(dependent);

        graph.deps('/dependent').should.eql([independent, dependent]);
    });

    it('should create deps array with two BEM objects with one expect another', function () {
        var independent = bemObject.fromPath('/independent');
        var dependent = bemObject.fromPath('/dependent', { expect: { block: 'independent' }});

        graph.add(independent);
        graph.add(dependent);

        graph.deps('/dependent').should.eql([dependent, independent]);
    });

    it('Deps array should contain only independent block', function () {
        var independent = bemObject.fromPath('/independent');
        var dependent = bemObject.fromPath('/dependent', { require: { block: 'independent' }});

        graph.add(independent);
        graph.add(dependent);

        graph.deps('/independent').should.eql([independent], 'Should contain only independent block');
    });

    it('Should contain only dependent block', function () {
        var independent1 = bemObject.fromPath('/independent1');
        var independent2 = bemObject.fromPath('/independent2');

        graph.add(independent1);
        graph.add(independent2);

        graph.deps('/independent1').should.eql([independent1]);
        graph.deps('/independent2').should.eql([independent2]);
    });

    it('Should properly handle BEM object in different levels', function () {
        var lvlBlock = bemObject.fromPath('/level/block');
        var block = bemObject.fromPath('/block');

        graph.add(lvlBlock);
        graph.add(block);

        graph.deps('/block').should.eql([lvlBlock, block]);
        graph.deps('/level/block').should.eql([lvlBlock]);
    });

    it('Should properly handle BEM object, when level BEM object expect another block', function () {
        var expectedLvlBlock = bemObject.fromPath('/level/expectedBlock');
        var lvlBlock = bemObject.fromPath('/level/block', { expect: { block: 'expectedBlock' }});
        var block = bemObject.fromPath('/block');

        graph.add(expectedLvlBlock);
        graph.add(lvlBlock);
        graph.add(block);

        graph.deps('/block').should.eql([lvlBlock, block, expectedLvlBlock]);
        graph.deps('/level/block').should.eql([lvlBlock, expectedLvlBlock]);
    });

    it('Should properly handle BEM object, when level BEM object require another block', function () {
        var requiredLvlBlock = bemObject.fromPath('/level/requiredBlock');
        var lvlBlock = bemObject.fromPath('/level/block', { require: { block: 'requiredBlock' }});
        var block = bemObject.fromPath('/block');

        graph.add(requiredLvlBlock);
        graph.add(lvlBlock);
        graph.add(block);

        graph.deps('/block').should.eql([requiredLvlBlock, lvlBlock, block]);
        graph.deps('/level/block').should.eql([requiredLvlBlock, lvlBlock]);
    });

    it('Should properly handle BEM object, which require BEM object from upper level', function () {
        var requiredLvlBlock = bemObject.fromPath('/level/requiredBlock');
        var block = bemObject.fromPath('/block', { require: { block: 'requiredBlock' }});

        graph.add(requiredLvlBlock);
        graph.add(block);

        graph.deps('/block').should.eql([requiredLvlBlock, block]);
    });

    it('Should properly handle BEM object, which expect BEM object from upper level', function () {
        var expectedLvlBlock = bemObject.fromPath('/level/expectedBlock');
        var block = bemObject.fromPath('/block', { expect: { block: 'expectedBlock' }});

        graph.add(expectedLvlBlock);
        graph.add(block);

        graph.deps('/block').should.eql([block, expectedLvlBlock]);
    });

    it('Should throw exception, when cannot find required or expected block in all levels', function () {

        var expectingBlock = bemObject.fromPath('/expectingBlock', { expect: { block: 'nonExistingBlock' }});
        var requiringBlock = bemObject.fromPath('/requiringBlock', { require: { block: 'nonExistingBlock' }});

        graph.add(bemObject.fromPath('/level1/anotherBlock'));
        graph.add(bemObject.fromPath('/level2/anotherBlock'));
        graph.add(bemObject.fromPath('/level3/anotherBlock'));
        graph.add(expectingBlock);
        graph.add(requiringBlock);

        (function() {
            graph.deps('/expectingBlock');
        }).should.throw();

        (function() {
            graph.deps('/requiringBlock');
        }).should.throw();
    });

});
