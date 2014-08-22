var flatit = require('flatit');
var bemObject = require('bem-object');
var Levels = require('./levels.js').Levels;

function DepsGraph(parent) {
    parent = parent || {};
    this.levels = new Levels(parent.levels);
    this._stack = [];
}

function pluck(prop) { return function (o) { return o[prop]; }; }

DepsGraph.prototype.formatError = function (bem) {
    var message = 'Not found `' + bem.level + '/' + bem.id + '`';

    if (this._stack.length > 1) { message += '\n'; }

    for (var i = this._stack.length - 2; i >= 0; i--) {
        var obj = this._stack[i];
        message += '\tfrom ' + obj.level + '/' + obj.id + '\n';
    }
    return new Error(message);
};

DepsGraph.prototype.deps = function (path) {
    if (typeof path !== 'string') {
        throw new Error('Path argument should be a String, not an ' + typeof path);
    }

    var bem = bemObject.fromPath(path);
    var level = this.levels.get(bem.level);

    bem = level && level.get(bem);

    if (!bem) {
        throw new Error('Not found `' + path + '`');
    }

    return this._deps(bem);
};

DepsGraph.prototype._deps = function (bem) {
    this._stack.push(bem);
    var parentBems = this.getParentBems(bem);

    var _bem = bem;
    bem = this.levels.get(bem.level).get(bem);

    if (!bem && parentBems.length === 0) {
        throw this.formatError(_bem);
    }

    var require = flatit(parentBems.map(pluck('required')))
            .map(this._deps, this);
    if (bem) { require = require.concat(bem.required.map(this._deps, this)); }

    var self = [parentBems];
    if (bem) { self.push(bem); }

    var expect = flatit(parentBems.map(pluck('expected')))
        .map(this._deps, this);

    if (bem) { expect = expect.concat(bem.expected.map(this._deps, this)); }

    this._stack.pop();
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
