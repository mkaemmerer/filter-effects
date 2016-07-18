const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const createElement = ({nodeName, children = [], ...attrs}) => {
  const element = document.createElementNS(SVG_NAMESPACE, nodeName);

  Object.keys(attrs)
    .forEach(key => {
      element.setAttribute(key, attrs[key]);
    });
  children.map(createElement)
    .forEach(child => {
      element.appendChild(child);
    });

  return element;
};

export function build(nodes, filterAttrs = {}){
  return createElement({nodeName: 'filter', children: nodes, ...filterAttrs});
}

export function run(nodes, filterAttrs = {}){
  const svg = createElement({
    nodeName: 'svg',
    children: [{
      nodeName: 'defs',
      children: [build(nodes, filterAttrs)]
    }]
  });
  document.appendChild(svg);
}
