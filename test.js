import { Monad, run, print }  from './index';
import * as n from './index';


//TEST

// <filter id="shadow" x0="-50%" y0="-50%" width="200%" height="200%"
//         filterUnits="userSpaceOnUse">
//   <feColorMatrix in="SourceGraphic" type="matrix"
//                  values="1 0 0  0 0
//                          0 1 0  0 0
//                          0 0 1  0 0
//                          0 0 0 -1 1"
//                  result="INVERSE"/>
//   <feColorMatrix in="SourceGraphic" type="matrix"
//                  values="1 0 0   0 0
//                          0 1 0   0 0
//                          0 0 1   0 0
//                          0 0 0 0.7 0"
//                  result="ATTENUATED"/>
//
//   <feGaussianBlur in="INVERSE" stdDeviation="2" result="SHADOW" />
//   <feOffset dy="-3" in="SHADOW" result="SHIFTED_SHADOW"></feOffset>
//
//   <feComposite operator="in" in="SHIFTED_SHADOW" in2="SourceGraphic" result="CLIPPED_SHADOW"/>
//   <feBlend mode="multiply" in="SourceGraphic" in2="CLIPPED_SHADOW" result="FULL_EFFECT"/>
//   <feBlend mode="normal" in="ATTENUATED" in2="FULL_EFFECT" result="OUTPUT"/>
// </filter>

const crossFade = (x, y, amount) => Monad.do(function *() {
  const attenuated = yield n.feColorMatrix({
    in: x,
    type: 'matrix',
    values: `1 0 0   0 0
             0 1 0   0 0
             0 0 1   0 0
             0 0 0 0.7 0`
  });
  const blend      = yield n.feBlend({
    in:  attenuated,
    in2: y,
    mode: 'normal'
  });

  return Monad.of(blend);
});

const program = Monad.do(function *() {
  const source     = yield n.sourceGraphic();
  const inverse    = yield n.feColorMatrix({
    in: source,
    type: 'matrix',
    values: `1 0 0  0 0
             0 1 0  0 0
             0 0 1  0 0
             0 0 0 -1 1`
  });
  const shadow     = yield n.feGaussianBlur({
    in: inverse,
    stdDeviation: 2
  });
  const shifted    = yield n.feOffset({
    in: shadow,
    dy: -3
  });
  const clipped    = yield n.feComposite({
    in:  shifted,
    in2: source,
    operator: 'in'
  });
  const full       = yield n.feBlend({
    in:  source,
    in2: clipped,
    mode: 'multiply'
  });
  const blend      = yield crossFade(source, full, 0.7);

  return Monad.of(blend);
});

const filterAttrs = {
  id:     'shadow',
  x0:     '-50%',
  y0:     '-50%',
  width:  '200%',
  height: '200%'
};

console.log(print(run(program), filterAttrs));
