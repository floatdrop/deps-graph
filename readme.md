# deps-graph

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

This module constructs dependency graph of blocks, constructed with [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object). It relies on `require` and `expect` properties in BEM objects to build connections between blocks.

`require` and `expect` can be `BEMObject` or `Array` of BEMObjects.

## API

### DepsGraph([parent])

Constructor. Can accept parent DepsGraph.

### DepsGraph.add(BEMObject...)
Returns: nothing  

Stores [BEM object](https://github.com/floatdrop/gulp-bem#bem-object) in graph.

### DepsGraph.deps(bem)
Type: `Object`  
Returns: `Array` of [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object).

Gets all dependencies for block. Returns dependencies in order, that defined by `require` and `expect` of corresponding BEM objects and levels of declaration.

It will throw `NotFound` exception, when `path` or any block in dependencies of blocks is not found.

## License

MIT (c) 2014 Vsevolod Strukchinsky, Vladimir Starkov

[npm-url]: https://npmjs.org/package/deps-graph
[npm-image]: http://img.shields.io/npm/v/deps-graph.svg?style=flat

[travis-url]: http://travis-ci.org/floatdrop/deps-graph
[travis-image]: http://img.shields.io/travis/floatdrop/deps-graph.svg?branch=master&style=flat

[depstat-url]: https://david-dm.org/floatdrop/deps-graph
[depstat-image]: http://img.shields.io/david/floatdrop/deps-graph.svg?style=flat

[coveralls-url]: https://coveralls.io/r/floatdrop/deps-graph
[coveralls-image]: http://img.shields.io/coveralls/floatdrop/deps-graph.svg?style=flat
