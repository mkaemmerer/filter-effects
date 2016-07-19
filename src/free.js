import match from './match';

export default class Free {
  constructor(type, next, result){
    this.type   = type;
    this.next   = next;
    this.result = result;
  }
  static impure(next, result){
    return new Free('IMPURE', next, result);
  }
  static pure(result){
    return new Free('PURE', undefined, result);
  }

  map(f){
    return match(this)({
      IMPURE: ({next, result}) => {
        const f_next = x => next(x).map(f);
        return Free.impure(f_next, result);
      },
      PURE: ({result}) => Free.pure(f(result))
    });
  }
  flatten(){
    return match(this)({
      IMPURE: ({next, result}) => {
        const inner_next = x => next(x).flatten();
        return Free.impure(inner_next, result);
      },
      PURE: ({result}) => result
    });
  }
  flatMap(f){
    return this.map(f).flatten();
  }
  iterate(ctx, change, step, done){
    return match(this)({
      IMPURE: ({next, result}) =>
        next(step(ctx, result))
          .iterate(change(ctx, result), change, step, done),
      PURE:   () => ctx
    });
  }
}
