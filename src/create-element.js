const SVG_NAMESPACE   = 'http://www.w3.org/2000/svg';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

const createElement = ({nodeName, children = [], ...attrs}) => {
  const element = document.createElementNS(SVG_NAMESPACE, nodeName);

  Object.keys(attrs)
    .forEach(key => {
      if(key === 'xlink:href'){
        element.setAttributeNS(XLINK_NAMESPACE, 'href', attrs[key]);
      } else {
        element.setAttribute(key, attrs[key]);
      }
    });
  children.map(createElement)
    .forEach(child => {
      element.appendChild(child);
    });

  return element;
};

export default createElement;
