//Filter Effect data type
class FilterEffect {
  constructor({type, attrs, next}){
    this.type  = type;
    this.attrs = attrs;
    this.next  = next;
  }
  map(f){
    return new FilterEffect({
      type:  this.type,
      attrs: this.attrs,
      next:  x => f(this.next(x))
    });
  }
  toJS(){
    return {
      type: this.type,
      ...this.attrs
    };
  }
}

//Free
class Free {
  constructor(type, next, result){
    this.type   = type;
    this.next   = next;
    this.result = result;
  }
  static impure(next){
    return new Free('IMPURE', next, undefined);
  }
  static pure(result){
    return new Free('PURE', undefined, result);
  }

  map(f){
    switch(this.type){
      case 'IMPURE':
        const f_next = this.next
          .map(inner => inner.map(f));
        return Free.impure(f_next);
      case 'PURE':
        return Free.pure(f(this.result));
    }
  }
  flatten(){
    switch(this.type){
      case 'IMPURE':
        const inner_next = this.next
          .map(inner => inner.flatten());
        return Free.impure(inner_next);
      case 'PURE':
        return this.result;
    }
  }
  flatMap(f){
    return this.map(f).flatten();
  }
  // foldMap(step, done){
  //   switch(this.type){
  //     case 'IMPURE':
  //       const next = this.next.next(this);
  //       return step(this.next).flatMap();
  //     case 'PURE':
  //       return done(this.result);
  //   }
  // }
}

//Nodes
const liftF = cmd => Free.impure(cmd.map(Free.pure));
const id    = x => x;

const createNode = type => attrs => {
  const node = new FilterEffect({
    type,
    attrs,
    next: id
  });
  return liftF(node);
};

//Node types
const feBlend             = createNode('feBlend');
const feColorMatrix       = createNode('feColorMatrix');
const feComponentTransfer = createNode('feComponentTransfer');
const feComposite         = createNode('feComposite');
const feConvolveMatrix    = createNode('feConvolveMatrix');
const feDiffuseLighting   = createNode('feDiffuseLighting');
const feDisplacementMap   = createNode('feDisplacementMap');
const feFlood             = createNode('feFlood');
const feFuncA             = createNode('feFuncA');
const feFuncB             = createNode('feFuncB');
const feFuncG             = createNode('feFuncG');
const feFuncR             = createNode('feFuncR');
const feGaussianBlur      = createNode('feGaussianBlur');
const feImage             = createNode('feImage');
const feMerge             = createNode('feMerge');
const feMergeNode         = createNode('feMergeNode');
const feMorphology        = createNode('feMorphology');
const feOffset            = createNode('feOffset');
const feSpecularLighting  = createNode('feSpecularLighting');
const feTile              = createNode('feTile');
const feTurbulence        = createNode('feTurbulence');

//Interpreter
const run = program => interpret({id: 0, nodes: []}, program);
const interpret = (env, program) => {
  const {type, next, result} = program;
  let node;

  switch(type){
    case 'IMPURE':
      node = next;

      const output = {
        result: env.id,
        ...node.toJS()
      };
      
      const next_env = {
        id:    env.id+1,
        nodes: env.nodes.concat([output])
      };
      const next_program = node.next(env.id);
      return interpret(next_env, next_program);
    case 'PURE':
      return env.nodes;
  }
};


//TEST
const program = feBlend()
  .flatMap((x) => feBlend({in: x}))
  .flatMap((x) => feBlend({in: x}));

console.log(run(program));
