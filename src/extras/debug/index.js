import drawGraph from './draw-graph';
import makeGraph from './make-graph';
import createElement from '../../create-element';

export default function debug(nodes, filterAttrs = {}){
  const svg = drawGraph(makeGraph(nodes, filterAttrs));
  return createElement(svg);
}
