import match from './match';

class Writer {
  constructor({result, nodes, id}){
    this.id     = id;
    this.result = result;
    this.nodes  = nodes;
  }
  map(f){
    return new Writer({
      ...this,
      result: f(this.result)
    });
  }
  flatten(){
    const inner = this.result;
    return new Writer({
      result: inner.result,
      nodes:  this.nodes.concat(inner.nodes),
      id:     this.id+1,
    });
  }
  flatMap(f){
    return this.map(f).flatten();
  }
  static of(x){
    return new Writer({
      id:     0,
      result: 0,
      nodes:  [x]
    });
  }
  static out(result){
    return new Writer({
      id:     0,
      result: result,
      nodes:  []
    });
  }
}


const run = program => {
  const ret = program.foldFree(
    match({
      sourceAlpha:   ()   => Writer.out('sourceAlpha'),
      sourceGraphic: ()   => Writer.out('sourceGraphic'),
      _:             node => Writer.of(node.toJS())
    }),
    Writer.of
  );

  return ret.nodes;
};

export default run;
