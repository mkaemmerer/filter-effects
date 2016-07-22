const inits = array =>
  array.map((_, i) => array.slice(0, i+1));

const usesSource = (name) => (filterEffect) =>
  filterEffect.in === name || filterEffect.in2 === name;

export default function makeGraph({filterEffects, filterAttrs}){
  const sourceGraphic = {
    result: 'SourceGraphic',
    filterEffects:  []
  };
  const sourceAlpha   = {
    result: 'SourceAlpha',
    filterEffects:  []
  };
  const filtered      = inits(filterEffects)
    .map((ns, i) => ({
      result:        ns[ns.length-1].result,
      filterEffects: ns,
      filterAttrs
    }));


  let result = filtered;
  if(filterEffects.find(usesSource('SourceAlpha'))){
    result.unshift(sourceAlpha);
  }
  if(filterEffects.find(usesSource('SourceGraphic'))){
    result.unshift(sourceGraphic);
  }
  result.forEach((node, index) => {
    node.order = index;
  });

  return result;
}
