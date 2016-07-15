import Free   from './src/free';
import * as n from './src/nodes';

//Interpreter
const run = program => interpret({id: 0, nodes: [], result: undefined}, program);
const interpret = (env, program) => {
  const {type, next, result} = program;
  let node;

  const process = node => {
    switch(node.type){
      case 'sourceAlpha':
        return {
          id:     env.id,
          nodes:  env.nodes,
          result: 'sourceGraphic'
        };
      case 'sourceGraphic':
        return {
          id:     env.id,
          nodes:  env.nodes,
          result: 'sourceGraphic'
        };
      default:
        const output = {
          result: env.id,
          ...node.toJS()
        };
        return {
          id:     env.id+1,
          nodes:  env.nodes.concat([output]),
          result: env.id
        };
    }
  }

  switch(type){
    case 'IMPURE':
      node = next;
      const next_env     = process(node);
      const next_program = node.next(next_env.result);
      return interpret(next_env, next_program);
    case 'PURE':
      return env.nodes;
  }
};


//TEST
const program = n.sourceGraphic()
  .flatMap((x) => n.feBlend({in: x}))
  .flatMap((x) => n.feBlend({in: x}));

console.log(run(program));
