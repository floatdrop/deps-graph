/* global describe, it */
var Level = require('../levels.js').Level;
var bem = require('bem-object').fromPath;
require('should');

describe('level', function () {
    it('should accept name as argument', function () {
        var level = new Level('name');
        level._name.should.eql('name');
    });

    it('should store bem object', function () {
        var level = new Level();
        var block = bem('/block');
        level.add(block);
        level.list().should.eql([block.id]);
    });

    it('should retrieve bem object', function () {
        var level = new Level();
        var block = bem('/block');
        level.add(block);
        var result = level.get(block);
        result.should.equal(block);
    });
});
