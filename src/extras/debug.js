import createElement from '../create-element';

const WIDTH  = 150;
const HEIGHT = 100;

const inits = array =>
  array.map((_, i) => array.slice(0, i+1));

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


const makeFilter   = (filterAttrs) => (ns, i) => ({
  nodeName: 'filter', children: ns, ...filterAttrs, id: `debug-${i+1}`
});
const makeSample   = (ns, i) => ({
  image: {
    nodeName:     'image',
    'xlink:href': '../scene.svg',
    'clip-path':  `url("#debug-clip-${i}")`,
    style:        ns.length ? `filter: url("#debug-${i}")` : '',
    x:      '10',
    y:      `${10 + i * HEIGHT}`,
    width:  WIDTH,
    height: HEIGHT
  },
  background: {
    nodeName: 'rect',
    style:    `fill: url("#debug-pattern-fill")`,
    x:      '10',
    y:      `${10 + i * HEIGHT}`,
    width:  WIDTH,
    height: HEIGHT
  },
  clipPath: {
    nodeName: 'clipPath',
    id:       `debug-clip-${i}`,
    children: [{
      nodeName: 'rect',
      x: '10',
      y: `${10 + i * HEIGHT}`,
      width:  WIDTH,
      height: HEIGHT,
    }]
  }
});

export default function build(nodes, filterAttrs = {}){
  const passes = inits(nodes);

  const filters = passes.map(makeFilter(filterAttrs));
  const samples = [[], ...passes].map(makeSample);

  const svg = {
    nodeName: 'svg',
    width:    (20 + WIDTH),
    height:   (20 + (nodes.length + 1) * HEIGHT),
    viewBox:  `0 0 ${(20 + WIDTH)} ${(20 + (nodes.length + 1) * HEIGHT)}`,
    children: [{
        nodeName: 'defs',
        children: [patternFill, ...filters, ...samples.map(s => s.clipPath)]
      },
      ...samples.map(s => s.background),
      ...samples.map(s => s.image)
    ]
  };

  return createElement(svg);
}
