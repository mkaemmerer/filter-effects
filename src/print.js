const printAttrs = attrs =>
  Object.keys(attrs)
    .map(key => `${key}="${attrs[key]}"`)
    .join(' ');

const printNode = node => {
  const {nodeName, ...attrs} = node;
  return `<${nodeName} ${printAttrs(attrs)}/>`;
};

export default function print(nodes, filterAttrs = {}){
  const children = nodes.map(printNode)
    .join('\n');

  return `<filter ${printAttrs(filterAttrs)}>\n${children}\n</filter>`;
}
