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
