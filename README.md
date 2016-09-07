# Filter Effects

A library for writing SVG filter effects using the convenience of generators.


### Composing filter effects

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

```javascript
let filterGoo = (source) => Filter.do(function *(){
  let blur   = yield feGaussianBlur({ in: source, stdDeviation: 7 });
  let goo    = yield feColorMatrix({ in: blur, mode: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" });
  let result = yield feComposite({ in: source, in2: goo });

  return Filter.of(result);
});
let filterShadow = (source) => Filter.do(function *(){
  let fill   = yield feFlood({ 'flood-color': '#444' });
  let clip   = yield feComposite({ in: fill, in2: source, operator: 'in' });
  let blur   = yield feGaussianBlur({ in: clip, stdDeviation: 3 });
  let offset = yield feOffset({ in: blur, dx: 0, dy: 5 });
  let result = yield feBlend({ in: source, in2: offset, mode: "normal" });

  return Filter.of(result);
});
let compose = (f1, f2) => (source) => Filter.do(function *(){
  let result1 = yield f1(source);
  let result2 = yield f2(result1);

  return Filter.of(result2);
});

let filterGooThenShadow = compose(filterGoo, filterShadow);
```
