# deps-graph [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

## API

### DepsGraph()

Constructor.

### DepsGraph.addDep(dep)
Returns: nothing  

Stores dep object in graph. Dep object should contain all properties, that are defined in [deps-entity declaration](http://bem.info/tools/bem/bem-tools/depsjs/). Also it can contain properties from [vinyl file](https://github.com/wearefractal/vinyl) of deps-entity. And finally parsed bem properties from path (by [default bem convention](http://bem.info/tools/bem/bem-tools/levels/) about directory structure):

 * `level` - parent directory of block
 * `block` - block directory
 * `elem` - elem directory (without `__`)
 * `mod` - mod directory  (without `_`)

### DepsGraph.dependencies(path)
Returns: `Array`  

Gets all dependencies for block at path. Path is equivalent of `level/block/__elem/_mod`. Returned dependencies are sorted in order, that defined by `mustDeps` and `shouldDeps` of corresponding deps-entities and levels of declaration.

Returned array should contain objects with required fields: 

 * `path` - path on filesystem to folder, that contains block files
 * `bem` - right formed BEM identifier that corresponds to that block
 * `block` - block name
 * `elem` - element name
 * `mod` - modificator
 * `value` - modificator value

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/deps-graph
[npm-image]: https://badge.fury.io/js/deps-graph.png

[travis-url]: http://travis-ci.org/floatdrop/deps-graph
[travis-image]: https://travis-ci.org/floatdrop/deps-graph.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/deps-graph
[depstat-image]: https://david-dm.org/floatdrop/deps-graph.png?theme=shields.io
