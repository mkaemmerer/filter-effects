import Monad  from './monad';
import run    from './interpreter';
import print  from './print';
import { build, create } from './build';

class Filter {
  constructor(program, filterAttrs = {}){
    this.filterEffects = run(program);
    this.filterAttrs   = filterAttrs;
  }
  print(){
    return print(this);
  }
  build(){
    return build(this);
  }
  create(){
    return create(this);
  }
}

const Factory = (program, filterAttrs) =>
  new Filter(program, filterAttrs);

Factory.do = Monad.do;
Factory.of = Monad.of;

export default Factory;
