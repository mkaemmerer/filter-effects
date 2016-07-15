import match from './match';

export default class Free {
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
    return match({
      IMPURE: ({next}) => {
        const f_next = next
          .map(inner => inner.map(f));
        return Free.impure(f_next);
      },
      PURE: ({result}) => Free.pure(f(result))
    })(this);
  }
  flatten(){
    return match({
      IMPURE: ({next}) => {
        const inner_next = next
          .map(inner => inner.flatten());
        return Free.impure(inner_next);
      },
      PURE: ({result}) => result
    })(this);
  }
  flatMap(f){
    return this.map(f).flatten();
  }
}
