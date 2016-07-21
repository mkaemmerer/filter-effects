const WIDTH  = 150;
const HEIGHT = 100;


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
const makeSample   = ({nodes, order}) => ({
  image: {
    nodeName:     'image',
    'xlink:href': '../scene.svg',
    'clip-path':  `url("#debug-clip-${order}")`,
    style:        nodes.length ? `filter: url("#debug-${order}")` : '',
    x:      '10',
    y:      `${10 + order * HEIGHT}`,
    width:  WIDTH,
    height: HEIGHT
  },
  background: {
    nodeName: 'rect',
    style:    `fill: url("#debug-pattern-fill")`,
    x:      '10',
    y:      `${10 + order * HEIGHT}`,
    width:  WIDTH,
    height: HEIGHT
  },
  clipPath: {
    nodeName: 'clipPath',
    id:       `debug-clip-${order}`,
    children: [{
      nodeName: 'rect',
      x: '10',
      y: `${10 + order * HEIGHT}`,
      width:  WIDTH,
      height: HEIGHT,
    }]
  }
});

export default function drawGraph(graph){
  const filters = graph
    .filter(vertex => vertex.nodes.length > 0)
    .map(makeFilter);
  const samples = graph.map(makeSample);

  const svg = {
    nodeName: 'svg',
    width:    (20 + WIDTH),
    height:   (20 + (graph.length + 1) * HEIGHT),
    viewBox:  `0 0 ${(20 + WIDTH)} ${(20 + (graph.length + 1) * HEIGHT)}`,
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
