import createElement from './create-element';

export function build({filterEffects, filterAttrs}){
  return createElement({
    nodeName: 'filter',
    ...filterAttrs,
    children: filterEffects
  });
}

export function create({filterEffects, filterAttrs}){
  const svg = createElement({
    nodeName: 'svg',
    width:    '0',
    height:   '0',
    style:    'position: absolute',
    children: [{
      nodeName: 'defs',
      children: [{nodeName: 'filter', ...filterAttrs, children: filterEffects}]
    }]
  });
  document.body.appendChild(svg);
}
