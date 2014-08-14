# deps-graph [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This module constructs dependency graph of blocks, constructed with [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object).

## API

### DepsGraph([parent])

Constructor. Can accept parent DepsGraph.

### DepsGraph.add(BEMObject)
Returns: nothing  

Stores [BEM object](https://github.com/floatdrop/gulp-bem#bem-object) in graph.

### DepsGraph.dependencies(path)
Returns: `Array` of [BEM objects](https://github.com/floatdrop/gulp-bem#bem-object).

Gets all dependencies for block at path. Path is equivalent of `level/block/__elem/_mod`. Returned dependencies are sorted in order, that defined by `mustDeps` and `shouldDeps` of corresponding deps-entities and levels of declaration.

## License

MIT (c) 2014 Vsevolod Strukchinsky, Vladimir Starkov

[npm-url]: https://npmjs.org/package/deps-graph
[npm-image]: https://badge.fury.io/js/deps-graph.png

[travis-url]: http://travis-ci.org/floatdrop/deps-graph
[travis-image]: https://travis-ci.org/floatdrop/deps-graph.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/deps-graph
[depstat-image]: https://david-dm.org/floatdrop/deps-graph.png?theme=shields.io
