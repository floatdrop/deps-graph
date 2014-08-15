var Graph = require('algorithms').DataStructure.Graph;

Array.prototype.contain = function(item) {
    return this.indexOf(item) !== -1;
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

function DepsGraph() {
    this.graph = new Graph();
    this.graph.addVertex('root');
}

DepsGraph.prototype._getLevels = function () {
    return this.graph.neighbors('root');
};

DepsGraph.prototype._addlevel = function (level) {
    this.graph.addVertex(level);
    this.graph.addEdge(level, this._getLevels().last() || 'root');
    this.graph.addEdge('root', level, this._getLevels().length);
};

DepsGraph.prototype.deps = function (path) {
    if (!this.graph.vertices.contain(path)) {
        throw new Error('BEM object with path `' + path + '` not found');
    } else {
        if (this._getLevels().contain(path)) {
            throw new Error('BEM object with path `' + path + '` cannot be a level');
        }
    }

};

DepsGraph.prototype.add = function (bemObject) {
    if (!this._getLevels().contain(bemObject.level)) {
        this._addlevel(bemObject.level);
    }

    this.graph.addVertex(bemObject.path);
    this.graph.addEdge(bemObject.path, bemObject.level);
};

module.exports = DepsGraph;
