export default class FilterEffect {
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
