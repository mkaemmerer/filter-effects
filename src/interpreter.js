import match from './match';
import {matchOn} from './match';

// Convert a free monad representation into a JSON representation
const default_env = {id: 0, nodes: []};
const process = (env, node) => matchOn('nodeName')({
  sourceAlpha:   () => env,
  sourceGraphic: () => env,
  _: node => {
    const output = {
      ...node.toJS(),
      result: env.id
    };
    return {
      id:     env.id+1,
      nodes:  [...env.nodes, output],
    };
  }
})(node);
const result = (env, node) => matchOn('nodeName')({
  sourceAlpha:   () => 'SourceAlpha',
  sourceGraphic: () => 'SourceGraphic',
  _:             () => env.id
});
const interpret = (env, program) => {
  return match({
    IMPURE: ({next, result: node}) => {
      const next_result  = result(env, node);
      const next_env     = process(env, node);
      const next_program = next(result);
      return interpret(next_env, next_program);
    },
    PURE:   () => env.nodes
  })(program);
};

// Remove unused nodes from the output
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
