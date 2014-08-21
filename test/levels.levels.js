/* global describe, it */
var Levels = require('../levels.js').Levels;
var bem = require('bem-object').fromPath;
var should = require('should');

describe('levels', function () {
    describe('create', function () {
        it('should work', function () {
            var levels = new Levels();
            levels.create('level').should.be.ok;
        });

        it('should return level, if it already exists', function () {
            var levels = new Levels();
            var level = levels.create('level');
            levels.create('level').should.equal(level);
        });
    });

    describe('get', function () {
        it('should return undefined, on unknown level', function () {
            var levels = new Levels();
            should.not.exist(levels.get('level'));
        });
    });

    describe('list', function () {
        it('should return array of levels names', function () {
            var levels = new Levels();
            levels.create('one');
            levels.create('two');
            levels.list().should.eql(['one', 'two']);
        });
    });

    describe('parents', function () {
        it('should return empty array on bottom level', function () {
            var levels = new Levels();
            levels.create('/one');
            var block = bem('/one/block');
            levels.parents(block).should.eql([]);
        });

        it('should return array of parent levels for block', function () {
            var levels = new Levels();
            var l1 = levels.create('/one');
            levels.create('/two');
            var block = bem('/two/block');
            levels.parents(block).should.eql([l1]);
        });

        it('should return empty array on unknown level', function () {
            var levels = new Levels();
            levels.create('/one');
            levels.create('/two');
            var block = bem('/three/block');
            levels.parents(block).should.eql([]);
        });
    });
});
