var flatit = require('flatit');
var sliced = require('sliced');
var bemObject = require('bem-object');

function DepsGraph() {
    this.graphs = {};
    this.levels = [];
}

function pluck(prop) { return function (o) { return o[prop]; }; }

DepsGraph.prototype.deps = function (bem) {
    if (typeof bem === 'string') {
        bem = this.findByPath(bem);
    }

    var parentLevels = this.parentLevels(bem);
    var parentBems = this.find(bem, parentLevels);

    var require = [
        flatit(parentBems.map(pluck('required'))).map(this.deps, this),
        bem.required.map(this.deps, this)
    ];

    var self = [parentBems];

    if (this.contains(bem)) {
        self.push(bem);
    } else if (parentBems.length === 0) {
        throw new Error('Not found `' + bem.path + '` in any levels.');
    }

    var expect = [
        flatit(parentBems.map(pluck('expected'))).map(this.deps, this),
        bem.expected.map(this.deps, this)
    ];

    return flatit([require, self, expect]);
};

DepsGraph.prototype.contains = function (bem) {
    if (typeof bem === 'string') {
        bem = bemObject.fromPath(bem);
    }

    return this.getLevel(bem.level) && this.getLevel(bem.level)[bem.id];
};

DepsGraph.prototype.findByPath = function (path) {
    var object = this.contains(path);
    if (object) { return object; }

    throw new Error('BEM object with path `' + path + '` not found');
};

function contains(array, object) { return array.indexOf(object) !== -1; }

DepsGraph.prototype.add = function () {
    for (var i = 0; i < arguments.length; i++) {
        var bem = arguments[i];
        if (!contains(this.levels, bem.level)) {
            this.createLevel(bem.level);
        }

        this.getLevel(bem.level)[bem.id] = bem;
    }
};

DepsGraph.prototype.createLevel = function (level) {
    this.levels.push(level);
    this.graphs[level] = {};
};

DepsGraph.prototype.parentLevels = function (bem) {
    var i = this.levels.indexOf(bem.level);
    return i === -1 ? [] : sliced(this.levels, 0, i).map(this.getLevel, this);
};

DepsGraph.prototype.getLevel = function (level) { return this.graphs[level]; };

DepsGraph.prototype.find = function (bem, levels) {
    return levels.reduce(function (previous, level) {
        var object = level[bem.id];
        if (object) { previous.push(object); }
        return previous;
    }, []);
};

module.exports = DepsGraph;
