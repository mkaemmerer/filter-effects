export default class FilterEffect {
  constructor({type, attrs, next}){
    this.type  = type;
    this.attrs = attrs;
    this.next  = next;
  }
  map(f){
    return new FilterEffect({
      ...this,
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
