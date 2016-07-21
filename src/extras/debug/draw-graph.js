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

const makeFilter   = ({filterEffects, filterAttrs, order}) => ({
  nodeName: 'filter',
  children: filterEffects,
  ...filterAttrs,
  id: `debug-${order}`
});
const makeSample   = ({filterEffects, order, bounds}) => ({
  image: {
    nodeName:     'image',
    'xlink:href': '../scene.svg',
    'clip-path':  `url("#debug-clip-${order}")`,
    style:        filterEffects.length ? `filter: url("#debug-${order}")` : '',
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
const makePath = ({points}) => ({
  nodeName: 'path',
  d: 'M' + points.map(({x,y}) => `${x}, ${y}`).join('L'),
  style: 'fill: none; stroke: #333;'
});

export default function drawGraph({nodes, edges, bounds}){
  const filters = nodes
    .filter(f => f.filterEffects.length > 0)
    .map(makeFilter);
  const samples = nodes.map(makeSample);
  const paths   = edges.map(makePath);

  const svg = {
    nodeName: 'svg',
    width:    bounds.width,
    height:   bounds.height,
    viewBox:  `0 0 ${bounds.width} ${bounds.height}`,
    children: [{
        nodeName: 'defs',
        children: [patternFill, ...filters, ...samples.map(s => s.clipPath)]
      },
      ...paths,
      ...samples.map(s => s.background),
      ...samples.map(s => s.image)
    ]
  };

  return svg;
}
