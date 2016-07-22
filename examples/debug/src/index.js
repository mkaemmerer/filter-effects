import Filter from 'filter-effects';
import * as f from 'filter-effects';
import debug from 'filter-effects/src/extras/debug';


const crossFade = (x, y, amt) => Filter.do(function *() {
  const attenuated = yield f.feColorMatrix({
    in: x,
    type: 'matrix',
    values: `1 0 0  0     0
             0 1 0  0     0
             0 0 1  0     0
             0 0 0 ${amt} 0`
  });
  const blend      = yield f.feBlend({
    in:  attenuated,
    in2: y,
    mode: 'normal'
  });

  return Filter.of(blend);
});

const dropShadow = source => Filter.do(function *() {
  const inverse    = yield f.feColorMatrix({
    in: source,
    type: 'matrix',
    values: `1 0 0  0 0
             0 1 0  0 0
             0 0 1  0 0
             0 0 0 -1 1`
  });
  const shadow     = yield f.feGaussianBlur({
    in: inverse,
    stdDeviation: 2
  });
  const shifted    = yield f.feOffset({
    in: shadow,
    dy: 5
  });
  const clipped    = yield f.feComposite({
    in:  shifted,
    in2: source,
    operator: 'in'
  });
  const full       = yield f.feBlend({
    in:  source,
    in2: clipped,
    mode: 'multiply'
  });
  const blend      = yield crossFade(source, full, 0.7);

  return Filter.of(blend);
});

const program = Filter.do(function *() {
  const source = yield f.sourceGraphic();
  const shadow = yield dropShadow(source);
  return Filter.of(shadow);
});

const filter = Filter(program, {
  id:     'inner-shadow',
  x0:     '-50%',
  y0:     '-50%',
  width:  '200%',
  height: '200%'
});

const svg = debug(filter);
document.body.appendChild(svg);
