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
    var parentBem = this.find(bem, parentLevels);

    var require = [
        parentBem.map(pluck('require')).map(this.deps),
        bem.require.map(this.deps)
    ];

    var self = [parentBem, bem];

    var expect = [
        parentBem.map(pluck('expect')).map(this.deps),
        bem.expect.map(this.deps)
    ];

    return flatit([require, self, expect]);
};

DepsGraph.prototype.findByPath = function (path) {
    if (typeof path !== 'string') {
        throw new Error('path parameter is not a string');
    }

    var bem = bemObject.fromPath(path);

    var g = this.graphs[bem.level];
    if (g) {
        var object = g[bem.bem];
        if (object) {
            return object;
        }
    }

    throw new Error('BEM object with path `' + path + '` not found');
};

DepsGraph.prototype.add = function (bem) {
    if (this.levels.indexOf(bem.level) === -1) {
        this.levels.push(bem.level);
        this.graphs[bem.level] = {};
    }

    this.graphs[bem.level][bem.bem] = bem;
 };

DepsGraph.prototype.parentLevels = function (bem) {
    var i = this.levels.indexOf(bem.level);
    return i === -1 ? sliced(this.levels, 0, i) : [];
};

DepsGraph.prototype.find = function (bem, levels) {
    var self = this;
    var graphs = levels.map(function (level) { return self.graphs[level]; });

    return graphs.reduce(function (previous, graph) {
        var bem = graph[bem.bem];
        if (bem) {
            previous.push(bem);
        }
    }, []);
};

module.exports = DepsGraph;
