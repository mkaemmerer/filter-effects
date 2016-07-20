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

export default function build(nodes, filterAttrs = {}){
  const filters = inits(nodes)
    .map((ns, i) => ({
      nodeName: 'filter', children: ns, ...filterAttrs, id: `debug-${i}`
    }));
  const clipPaths = filters
    .map((filter, i) => ({
      nodeName: 'clipPath',
      id:       `debug-clip-${i}`,
      children: [{
        nodeName: 'rect',
        x: '10',
        y: `${10 + i * HEIGHT}`,
        width:  WIDTH,
        height: HEIGHT,
      }]
    }));
  const backgrounds = filters
    .map((filter, i) => ({
      nodeName: 'rect',
      style:    `fill: url("#debug-pattern-fill")`,
      x: '10',
      y: `${10 + i * HEIGHT}`,
      width:  WIDTH,
      height: HEIGHT
    }));
  const samples = filters
    .map((filter, i) => ({
      nodeName: 'image',
      'xlink:href': '../scene.svg',
      'clip-path':  `url("#debug-clip-${i}")`,
      style:        `filter: url("#debug-${i}")`,
      x: '10',
      y: `${10 + i * HEIGHT}`,
      width:  WIDTH,
      height: HEIGHT
    }));

  const svg = {
    nodeName: 'svg',
    width:    (20 + WIDTH),
    height:   (20 + nodes.length * HEIGHT),
    viewBox:  `0 0 ${(20 + WIDTH)} ${(20 + nodes.length * HEIGHT)}`,
    children: [{
        nodeName: 'defs',
        children: [patternFill, ...filters, ...clipPaths]
      },
      ...backgrounds,
      ...samples
    ]
  };

  return createElement(svg);
}
