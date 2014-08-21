var flatit = require('flatit');
var bemObject = require('bem-object');
var Levels = require('./levels.js').Levels;

function DepsGraph(parent) {
    parent = parent || {};
    this.levels = new Levels(parent.levels);
}

function pluck(prop) { return function (o) { return o[prop]; }; }

DepsGraph.prototype.deps = function (path) {
    if (typeof path !== 'string') {
        throw new Error('Path argument should be a String, not an ' + typeof path);
    }

    var bem = bemObject.fromPath(path);
    var level = this.levels.get(bem.level);

    bem = level && level.get(bem);

    if (!bem) {
        throw new Error('Not found `' + path + '` in any levels.');
    }

    return this._deps(bem);
};

DepsGraph.prototype._deps = function (bem) {
    var parentBems = this.getParentBems(bem);

    var path = bem.path;
    bem = this.levels.get(bem.level).get(bem);

    if (!bem && parentBems.length === 0) {
        throw new Error('Not found `' + path + '` in any levels.');
    }

    var require = flatit(parentBems.map(pluck('required')))
            .map(this._deps, this);
    if (bem) { require = require.concat(bem.required.map(this._deps, this)); }

    var self = [parentBems];
    if (bem) { self.push(bem); }

    var expect = flatit(parentBems.map(pluck('expected')))
        .map(this._deps, this);

    if (bem) { expect = expect.concat(bem.expected.map(this._deps, this)); }

    return flatit([require, self, expect]);
};

DepsGraph.prototype.add = function () {
    for (var i = 0; i < arguments.length; i++) {
        var bem = arguments[i];
        var level = this.levels.create(bem.level);
        level.add(bem);
    }
};

DepsGraph.prototype.getParentBems = function (bem) {
    if (!bem) { return []; }
    var levels = this.levels.parents(bem);
    return levels.reduce(function (previous, level) {
        var found = level.get(bem);
        if (found) { previous.push(found); }
        return previous;
    }, []);
};

module.exports = DepsGraph;
