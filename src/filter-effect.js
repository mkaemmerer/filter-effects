export default class FilterEffect {
  constructor({nodeName, attrs}){
    this.nodeName = nodeName;
    this.attrs    = attrs;
  }
  toJS(){
    return {
      nodeName: this.nodeName,
      ...this.attrs
    };
  }
}
