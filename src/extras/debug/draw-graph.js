const backgroundPattern = {
  nodeName:     'pattern',
  id:           'debug-background-fill',
  width:        '50',
  height:       '50',
  patternUnits: 'userSpaceOnUse',
  children: [
    { nodeName: 'rect', x:'0',   y:'0', width:'50', height:'50', fill:   '#BDE' },
    { nodeName: 'line', x1:'0',  y1:'25', x2:'50', y2:'25',      stroke: '#FFF', opacity: '0.3' },
    { nodeName: 'line', x1:'25', y1:'0',  x2:'25', y2:'50',      stroke: '#FFF', opacity: '0.3' },
  ]
};
const transparentFill = {
  nodeName:     'pattern',
  id:           'debug-transparent-fill',
  width:        '20',
  height:       '20',
  patternUnits: 'userSpaceOnUse',
  children: [
    { nodeName: 'rect', fill: '#DDD',  x: '0',  y: '0',  width: '10', height: '10' },
    { nodeName: 'rect', fill: '#FFF',  x: '10', y: '0',  width: '10', height: '10' },
    { nodeName: 'rect', fill: '#FFF',  x: '0',  y: '10', width: '10', height: '10' },
    { nodeName: 'rect', fill: '#DDD',  x: '10', y: '10', width: '10', height: '10' }
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
    style:    `fill: url("#debug-transparent-fill")`,
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
  style: 'fill: none; stroke: #FFF; stroke-width: 2;'
});


export default function drawGraph({nodes, edges, bounds}){
  const filters = nodes
    .filter(f => f.filterEffects.length > 0)
    .map(makeFilter);
  const samples = nodes.map(makeSample);
  const paths   = edges.map(makePath);

  const svg = {
    nodeName: 'svg',
    viewBox:  `0 0 ${bounds.width} ${bounds.height}`,
    children: [{
        nodeName: 'defs',
        children: [backgroundPattern, transparentFill, ...filters, ...samples.map(s => s.clipPath)]
      },
      { nodeName: 'rect', x: '0', y: '0', ...bounds, style: 'fill: url(#debug-background-fill)' },
      ...paths,
      ...samples.map(s => s.background),
      ...samples.map(s => s.image)
    ],
    ...bounds
  };

  return svg;
}
