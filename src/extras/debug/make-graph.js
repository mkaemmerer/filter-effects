const inits = array =>
  array.map((_, i) => array.slice(0, i+1));

const usesSource = (name) => (node) =>
  node.in === name || node.in2 === name;

export default function makeGraph(nodes, filterAttrs = {}){
  const sourceGraphic = {
    result: 'SourceGraphic',
    nodes:  []
  };
  const sourceAlpha   = {
    result: 'SourceAlpha',
    nodes:  []
  };
  const filtered      = inits(nodes)
    .map((ns, i) => ({
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
  result.forEach((node, index) => {
    node.order = index;
  });

  return result;
}
