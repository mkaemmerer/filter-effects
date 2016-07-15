import match from './match';

const interpret = (env, program) => {
  const process = match({
    sourceAlpha: () => ({
      ...env,
      result: 'sourceAlpha'
    }),
    sourceGraphic: () => ({
      ...env,
      result: 'sourceGraphic'
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
    IMPURE: ({next: node}) => {
      const next_env     = process(node);
      const next_program = node.next(next_env.result);
      return interpret(next_env, next_program);
    },
    PURE:   () => env.nodes
  })(program);
};

const default_env = {id: 0, nodes: [], result: undefined};

const run = program =>
  interpret(default_env, program);

export default run;
