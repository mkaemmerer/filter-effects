const inits = array =>
  array.map((_, i) => array.slice(0, i+1));

const usesSource = (name) => (node) =>
  node.in === name || node.in2 === name;

export default function makeGraph(nodes, filterAttrs = {}){
  const sourceGraphic = {
    order:  0,
    result: 'SourceGraphic',
    nodes:  []
  };
  const sourceAlpha   = {
    order:  1,
    result: 'SourceAlpha',
    nodes:  []
  };
  const filtered      = inits(nodes)
    .map((ns, i) => ({
      order:  i+2,
      result: ns[ns.length-1].result,
      nodes:  ns,
      filterAttrs
    }));


  let result = filtered;
  if(nodes.find(usesSource('SourceAlpha'))){
    result.unshift(sourceAlpha);
  }
  if(nodes.find(usesSource('SourceGraphic'))){
    result.unshift(sourceGraphic);
  }
  return result;
}
