import createElement from './create-element';

export function build(nodes, filterAttrs = {}){
  return createElement({nodeName: 'filter', children: nodes, ...filterAttrs});
}

export function create(nodes, filterAttrs = {}){
  const svg = createElement({
    nodeName: 'svg',
    width:    '0',
    height:   '0',
    style:    'position: absolute',
    children: [{
      nodeName: 'defs',
      children: [{nodeName: 'filter', children: nodes, ...filterAttrs}]
    }]
  });
  document.body.appendChild(svg);
}
