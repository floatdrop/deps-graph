/* global describe, it */
var Levels = require('../levels.js').Levels;
var bem = require('bem-object').fromPath;
require('should');

describe('levels with parent', function () {
    it('should accept parent levels object', function () {
        var parent = new Levels();
        var levels = new Levels(parent);
        levels._parent.should.equal(parent);
    });

    it('parents should return levels from parent', function () {
        var parent = new Levels();
        var one = parent.create('/one');
        var levels = new Levels(parent);
        var two = levels.create('/two');
        levels.create('/three');

        var block = bem('/three/block');
        levels.parents(block).should.eql([one, two]);
    });

    it('get should return levels from parent', function () {
        var parent = new Levels();
        var one = parent.create('/one');
        var levels = new Levels(parent);
        levels.get('/one').should.eql(one);
    });
});
