const printAttrs = attrs =>
  Object.keys(attrs)
    .map(key => `${key}="${attrs[key]}"`)
    .join(' ');

const printNode = ({nodeName, children, ...attrs}) =>
  children
    ? `<${nodeName} ${printAttrs(attrs)}>
  ${children.map(printNode).join('\n')}
</${nodeName}>`
    : `<${nodeName} ${printAttrs(attrs)}/>`;

export default function print({filterEffects, filterAttrs}){
  const children = filterEffects.map(printNode)
    .join('\n');

  return `<filter ${printAttrs(filterAttrs)}>\n${children}\n</filter>`;
}
