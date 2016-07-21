import drawGraph from './draw-graph';
import makeGraph from './make-graph';
import layout    from './layout';
import createElement from '../../create-element';

export default function debug(filterEffects, filterAttrs = {}){
  const svg = drawGraph(layout(makeGraph(filterEffects, filterAttrs)));
  return createElement(svg);
}
