export default class FilterEffect {
  constructor({nodeName, attrs, next}){
    this.nodeName = nodeName;
    this.attrs    = attrs;
    this.next     = next;
  }
  map(f){
    return new FilterEffect({
      ...this,
      next:  x => f(this.next(x))
    });
  }
  toJS(){
    return {
      nodeName: this.nodeName,
      ...this.attrs
    };
  }
}
