import match from './match';
import {matchOn} from './match';

// Convert a free monad representation into a JSON representation
const interpret = (program) => {
  const start = {id: 0, nodes: []};
  const process = (env, node) => matchOn('nodeName')(node)({
    sourceAlpha:   ()   => env,
    sourceGraphic: ()   => env,
    _:             node => ({
      id:     env.id+1,
      nodes:  [...env.nodes, {
        ...node.toJS(),
        result: env.id
      }],
    })
  });
  const result = (env, node) => matchOn('nodeName')(node)({
    sourceAlpha:   () => 'SourceAlpha',
    sourceGraphic: () => 'SourceGraphic',
    _:             () => env.id
  });
  return program.fold(start, process, result).nodes;
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


const run = program => prune(interpret(program));

export default run;
