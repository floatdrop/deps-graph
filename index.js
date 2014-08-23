var flatit = require('flatit');
var Levels = require('./levels.js').Levels;

function DepsGraph(parent) {
    parent = parent || {};
    this.levels = new Levels(parent.levels);
    this._stack = [];
}

function toArray(obj) {
    if (!obj) { return []; }
    if (!Array.isArray(obj)) { return [obj]; }
    return obj;
}

DepsGraph.prototype.deps = function (bem) {
    var level = this.levels.get(bem.level);

    if (!level || !level.get(bem)) {
        throw new Error('Not found `' + bem.path + '`');
    }

    return this._deps('', bem);
};

function required (prev, curr) { return prev.concat(curr.require || []); }
function expected (prev, curr) { return prev.concat(curr.expect || []); }

DepsGraph.prototype._deps = function (type, bem) {
    this._stack.push(arguments);
    var parentBems = this.getParentBems(bem);

    var _bem = bem;

    var level = this.levels.get(bem.level);
    bem = level && level.get(bem);

    if (!bem && parentBems.length === 0) {
        throw this.formatError(_bem);
    }

    var require = parentBems.reduce(required, [])
        .map(this._deps.bind(this, 'required'));

    var self = [parentBems];

    var expect = parentBems.reduce(expected, [])
        .map(this._deps.bind(this, 'expected'));

    if (bem) {
        require = require.concat(
            toArray(bem.require).map(this._deps.bind(this, 'required'))
        );

        self.push(bem);

        expect = expect.concat(
            toArray(bem.expect).map(this._deps.bind(this, 'expected'))
        );
    }

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

DepsGraph.prototype.formatError = function (bem) {
    var message = 'Not found `' + bem.level + '/' + bem.id + '`';

    if (this._stack.length > 1) { message += '\n'; }

    for (var i = this._stack.length - 2; i >= 0; i--) {
        var frame = this._stack[i];
        var type = frame[0];
        var obj = frame[1];
        message += '\t' + type + 'from ' + obj.level + '/' + obj.id + '\n';
    }
    return new Error(message);
};

module.exports = DepsGraph;
