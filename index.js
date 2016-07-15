import * as n from './src/nodes';
import run    from './src/interpreter';


//TEST
const program = n.sourceGraphic()
  .flatMap((x) => n.feBlend({in: x}))
  .flatMap((x) => n.feBlend({in: x}));

console.log(run(program));
