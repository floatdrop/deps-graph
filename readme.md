# deps-graph [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

This module constructs dependency graph of blocks, constructed with [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object).

## API

### DepsGraph([parent])

Constructor. Can accept parent DepsGraph.

### DepsGraph.add(BEMObject)
Returns: nothing  

Stores [BEM object](https://github.com/floatdrop/gulp-bem#bem-object) in graph.

### DepsGraph.deps(path)
Returns: `Array` of [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object).

Gets all dependencies for block at path. Path is equivalent of `level/block/__elem/_mod`. Returns dependencies in order, that defined by `require` and `expect` of corresponding BEM objects and levels of declaration.

It will throw `NotFound` exception, when `path` or any block in dependencies of blocks is not found.

## License

MIT (c) 2014 Vsevolod Strukchinsky, Vladimir Starkov

[npm-url]: https://npmjs.org/package/deps-graph
[npm-image]: https://badge.fury.io/js/deps-graph.png

[travis-url]: http://travis-ci.org/floatdrop/deps-graph
[travis-image]: https://travis-ci.org/floatdrop/deps-graph.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/deps-graph
[depstat-image]: https://david-dm.org/floatdrop/deps-graph.png?theme=shields.io

[coveralls-url]: https://coveralls.io/r/floatdrop/deps-graph
[coveralls-image]: https://coveralls.io/repos/floatdrop/deps-graph/badge.png
