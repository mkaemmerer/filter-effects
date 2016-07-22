import drawGraph from './draw-graph';
import makeGraph from './make-graph';
import layout    from './layout';
import createElement from '../../create-element';

export default function debug(filter){
  const svg = drawGraph(layout(makeGraph(filter)));
  return createElement(svg);
}
