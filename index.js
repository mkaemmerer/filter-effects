import * as n from './src/nodes';
import run    from './src/interpreter';
import Monad  from './src/monad';


//TEST
const program = n.sourceGraphic()
  .flatMap((x) => n.feBlend({in: x}))
  .flatMap((x) => n.feBlend({in: x}));

console.log(run(program));


const program2 = Monad.do(function *() {
  const source = yield n.sourceGraphic();
  const blend1 = yield n.feBlend({in: source});
  const blend2 = yield n.feBlend({in: blend1});

  return Monad.of(blend2);
});

console.log(run(program2));
