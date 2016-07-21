const patternFill = {
  nodeName:     'pattern',
  id:           'debug-pattern-fill',
  width:        '20',
  height:       '20',
  patternUnits: 'userSpaceOnUse',
  children: [
    { nodeName: 'rect', fill:'#DDD',  x:'0',  y:'0',  width:'10', height:'10' },
    { nodeName: 'rect', fill:'#FFF',  x:'10', y:'0',  width:'10', height:'10' },
    { nodeName: 'rect', fill:'#FFF',  x:'0',  y:'10', width:'10', height:'10' },
    { nodeName: 'rect', fill:'#DDD',  x:'10', y:'10', width:'10', height:'10' }
  ]
};

const makeFilter   = ({nodes, filterAttrs, order}) => ({
  nodeName: 'filter',
  children: nodes,
  ...filterAttrs,
  id: `debug-${order}`
});
const makeSample   = ({nodes, order, bounds}) => ({
  image: {
    nodeName:     'image',
    'xlink:href': '../scene.svg',
    'clip-path':  `url("#debug-clip-${order}")`,
    style:        nodes.length ? `filter: url("#debug-${order}")` : '',
    ...bounds
  },
  background: {
    nodeName: 'rect',
    style:    `fill: url("#debug-pattern-fill")`,
    ...bounds
  },
  clipPath: {
    nodeName: 'clipPath',
    id:       `debug-clip-${order}`,
    children: [{
      nodeName: 'rect',
      ...bounds
    }]
  }
});

export default function drawGraph({graph, bounds}){
  const filters = graph
    .filter(vertex => vertex.nodes.length > 0)
    .map(makeFilter);
  const samples = graph.map(makeSample);

  const svg = {
    nodeName: 'svg',
    width:    bounds.width,
    height:   bounds.height,
    viewBox:  `0 0 ${bounds.width} ${bounds.height}`,
    children: [{
        nodeName: 'defs',
        children: [patternFill, ...filters, ...samples.map(s => s.clipPath)]
      },
      ...samples.map(s => s.background),
      ...samples.map(s => s.image)
    ]
  };

  return svg;
}
