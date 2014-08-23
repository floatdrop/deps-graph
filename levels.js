var sliced = require('sliced');

function Level(name) {
    this._name = name;
    this._objects = {};
}

Level.prototype.get = function (bem) {
    return this._objects[bem.id];
};

Level.prototype.add = function (bem) {
    this._objects[bem.id] = bem;
};

Level.prototype.list = function () {
    return Object.keys(this._objects);
};

function Levels(parent) {
    this._parent = parent;
    this._levels = {};
}

Levels.prototype.list = function () {
    return Object.keys(this._levels);
};

Levels.prototype.parents = function (bem) {
    var levels = this.list();
    if (this._parent) { levels = this._parent.list().concat(levels); }

    var i = levels.indexOf(bem.level);
    var parentLevels = i === -1 ? [] : sliced(levels, 0, i).map(this.get, this);

    return parentLevels;
};

Levels.prototype.create  = function (level) {
    this._levels[level] = this._levels[level] || new Level(level);
    return this._levels[level];
};

Levels.prototype.get = function (level) {
    return this._levels[level] || (this._parent && this._parent.get(level));
};

module.exports = {
    Levels: Levels,
    Level: Level
};
