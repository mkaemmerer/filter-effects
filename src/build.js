const SVG_NAMESPACE = "http://www.w3.org/2000/svg"
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink"

const createElement = ({ nodeName, children = [], ...attrs }) => {
  const element = document.createElementNS(SVG_NAMESPACE, nodeName)

  Object.keys(attrs).forEach((key) => {
    const match = key.match(/^xlink:(.*)/)
    if (match) {
      element.setAttributeNS(XLINK_NAMESPACE, match[1], attrs[key])
    } else {
      element.setAttribute(key, attrs[key])
    }
  })
  children.map(createElement).forEach((child) => {
    element.appendChild(child)
  })

  return element
}

export function build({ filterEffects, filterAttrs }) {
  return createElement({
    nodeName: "filter",
    ...filterAttrs,
    children: filterEffects,
  })
}

export function create({ filterEffects, filterAttrs }) {
  const svg = createElement({
    nodeName: "svg",
    height: "0",
    children: [
      {
        nodeName: "defs",
        children: [
          { nodeName: "filter", ...filterAttrs, children: filterEffects },
        ],
      },
    ],
  })
  document.body.appendChild(svg)
}
