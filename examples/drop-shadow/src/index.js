import { Monad, run, create }  from '../../../index';
import * as f from '../../../index';


const crossFade = (x, y, amt) => Monad.do(function *() {
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

  return Monad.of(blend);
});

const dropShadow = source => Monad.do(function *() {
  const alpha    = yield f.feColorMatrix({
    in: source,
    type: 'matrix',
    values: `0 0 0 0 0
             0 0 0 0 0
             0 0 0 0 0
             0 0 0 1 0`
  });
  const shadow     = yield f.feGaussianBlur({
    in: alpha,
    stdDeviation: 2
  });
  const shifted    = yield f.feOffset({
    in: shadow,
    dy: 5
  });
  const full       = yield f.feBlend({
    in:  source,
    in2: shifted,
    mode: 'normal'
  });
  const blend      = yield crossFade(full, source, 0.3);

  return Monad.of(blend);
});

const program = Monad.do(function *() {
  const source = yield f.sourceGraphic();
  const shadow = yield dropShadow(source);
  return Monad.of(shadow);
});

const filterAttrs = {
  id:     'drop-shadow',
  x0:     '-50%',
  y0:     '-50%',
  width:  '200%',
  height: '200%'
};

create(run(program), filterAttrs);
