# Filter Effects

A library for writing SVG filter effects using the convenience of generators.

## Table of Contents

- [Why Filter Effects?](#why-filter-effects)
	- [Compose Effects](#compose-effects)
	- [Reuse Common Patterns](#reuse-common-patterns)
- [Examples](#examples)
	- [Simple example](#simple-example)
	- [More examples](#more-examples)
- [API Reference](#api-reference)
	- [Filter](#filter)
	- [Filter.do](#filterdo)
	- [Filter.done](#filterdone)
	- [filter#build](#filterbuild)
	- [filter#create](#filtercreate)
	- [filter#print](#filterprint)
	- [Effects](#effects)
	- [Sources](#sources)


## Why Filter Effects?
### Compose Effects

Consider these two filter effects. One of them applies a gooey effect to shapes,
the other applies a drop shadow.

```HTML
<filter id="filter-goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
  <feColorMatrix in="blur" mode="matrix" result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
  <feComposite in="SourceGraphic" in2="goo" />
</filter>

<filter id="filter-shadow">
  <feFlood flood-color="#444" result="fill"/>
  <feComposite in="fill" in2="SourceGraphic" operator="in" result="clip"/>
  <feGaussianBlur stdDeviation="3" in="clip" result="blur"/>
  <feOffset dx="0" dy="5" in="blur" result="offset"/>
  <feBlend in="SourceGraphic" in2="offset" mode="normal"/>
</filter>
```

In order to apply both effects to the same graphic, you would have to copy both
effects into a new filter node. You would also have to replace `SourceGraphic`
in the second effect with the result of the first effect. Lastly, you would have
to make sure there were no name collisions between the two effects.

```HTML
<filter id="filter-goo-then-shadow">
  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="goo-blur" />
  <feColorMatrix in="goo-blur" mode="matrix" result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
  <feComposite in="SourceGraphic" in2="goo" result="goo-result"/>

  <feFlood flood-color="#444" result="fill"/>
  <feComposite in="fill" in2="goo-result" operator="in" result="clip"/>
  <feGaussianBlur stdDeviation="3" in="clip" result="shadow-blur"/>
  <feOffset dx="0" dy="5" in="shadow-blur" result="offset"/>
  <feBlend in="goo-result" in2="offset" mode="normal"/>
</filter>
```

By using the `filter-effects` library, you can compose effects without copying
and renaming. Here are the same effects rewritten using javascript.

```es6
let filterGoo = (source) => Filter.do(function *(){
  let blur   = yield feGaussianBlur({ in: source, stdDeviation: 7 });
  let goo    = yield feColorMatrix({ in: blur, mode: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" });
  let result = yield feComposite({ in: source, in2: goo });

  return Filter.done(result);
});
let filterShadow = (source) => Filter.do(function *(){
  let fill   = yield feFlood({ 'flood-color': '#444' });
  let clip   = yield feComposite({ in: fill, in2: source, operator: 'in' });
  let blur   = yield feGaussianBlur({ in: clip, stdDeviation: 3 });
  let offset = yield feOffset({ in: blur, dx: 0, dy: 5 });
  let result = yield feBlend({ in: source, in2: offset, mode: "normal" });

  return Filter.done(result);
});
let compose = (f1, f2) => (source) => Filter.do(function *(){
  let result1 = yield f1(source);
  let result2 = yield f2(result1);

  return Filter.done(result2);
});

let filterGooThenShadow = compose(filterGoo, filterShadow);
```

### Reuse Common Patterns

Many filter effects use common patterns. Using the `filter-effects` library, you
can extract these patterns into reusable functions. For example, here is a
helper function that loads an external image and tiles it.

```es6
let tiledImage = (path) => Filter.do(function *(){
  let image = yield feImage({"xlink:href": path});
  let tiled = yield feTile({ in: image });
  return Filter.done(tiled);
});
```

## Examples

### Simple example

```es6
import Filter from 'filter-effects';
import { sourceGraphic, feGaussianBlur, feColorMatrix, feComposite } from 'filter-effects';

let program => Filter.do(function *(){
  let source = yield sourceGraphic();
  let blur   = yield feGaussianBlur({ in: source, stdDeviation: 7 });
  let goo    = yield feColorMatrix({ in: blur, mode: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" });
  let result = yield feComposite({ in: source, in2: goo });
  return Filter.done(result);
});

let filter = Filter(program, {id: 'filter-goo' });
filter.print();
//  <filter id="filter-goo">
//  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="0"/>
//  <feColorMatrix in="0" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="1"/>
//  <feComposite in="SourceGraphic" in2="1" result="2"/>
//  </filter>
```

### More examples

You can find more examples in the examples directory.


## API Reference

### Filter
#### `Filter(program [, attrs])`

Make a filter from a filter program. Typically, filter programs will be created using `Filter.do`. This object can later be added to the document using `filter#create`, or printed as an XML string using `filter#print`. You can optionally specify any attributes you want to set on the resulting `<filter>` SVG node.

### Filter.do
#### `Filter.do(generator)`

Make a filter program from a generator function. This program can be passed to `Filter` to create a filter object.

### Filter.done
#### `Filter.done(label)`

Convert a label to a filter program. Typically, you will use `Filter.done` to wrap the return value of a generator passed to `Filter.do`.


### filter#build
#### `filter.build()`

Create SVG DOM nodes for a filter. Does not append them to the document.

### filter#create
#### `filter.create()`

Create SVG DOM nodes for a filter and append them to the document. Also wraps the filter nodes in `<svg>` and `<defs>` nodes.

### filter#print
#### `filter.print()`

Write the filter to a string as XML.


### Effects
* feBlend(attrs)
* feColorMatrix(attrs)
* feComponentTransfer(attrs)
* feComposite(attrs)
* feConvolveMatrix(attrs)
* feDiffuseLighting(attrs)
* feDisplacementMap(attrs)
* feFlood(attrs)
* feGaussianBlur(attrs)
* feImage(attrs)
* feMerge(attrs)
* feMergeNode(attrs)
* feMorphology(attrs)
* feOffset(attrs)
* feSpecularLighting(attrs)
* feTile(attrs)
* feTurbulence(attrs)

Append a filter effect to the program with the given attributes and return a unique `result` label for the node.


### Sources
* sourceGraphic()
* sourceAlpha()

Return a label for the source graphic or source alpha that can be passed to an effect as `in` or `in2`.
