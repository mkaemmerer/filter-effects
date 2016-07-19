import match from './match';
import {matchOn} from './match';

const default_env = {id: 0, nodes: [], result: undefined};
const interpret = (env, program) => {
  const process = matchOn('nodeName')({
    sourceAlpha: () => ({
      ...env,
      result: 'SourceAlpha'
    }),
    sourceGraphic: () => ({
      ...env,
      result: 'SourceGraphic'
    }),
    _: node => {
      const output = {
        ...node.toJS(),
        result: env.id
      };
      return {
        id:     env.id+1,
        nodes:  env.nodes.concat([output]),
        result: env.id
      };
    }
  });

  return match({
    IMPURE: ({next, result: node}) => {
      const next_env     = process(node);
      const next_program = next(next_env.result);
      return interpret(next_env, next_program);
    },
    PURE:   () => env.nodes
  })(program);
};

const prune = (nodes) => {
  const result = prune_once(nodes);
  return (result.length === nodes.length) ? result : prune(result);
};
const prune_once = (nodes) => {
  const last      = nodes[nodes.length - 1];
  const is_output = node => node === last;
  const is_used   = node => nodes
    .find(n => n.in === node.result || n.in2 === node.result);
  return nodes.filter(n => is_output(n) || is_used(n));
};


const run = program => prune(interpret(default_env, program));

export default run;
