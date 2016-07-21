import drawGraph from './draw-graph';
import makeGraph from './make-graph';
import layout    from './layout';
import createElement from '../../create-element';

export default function debug(nodes, filterAttrs = {}){
  const svg = drawGraph(layout(makeGraph(nodes, filterAttrs)));
  return createElement(svg);
}
