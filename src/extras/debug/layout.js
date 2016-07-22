import dagre from 'dagre';

const WIDTH  = 150;
const HEIGHT = 100;

const initGraph = () => {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ marginx: 50, marginy: 50 });
  graph.setDefaultEdgeLabel(() => ({}));
  return graph;
};
const setupGraph = (graph, filters) => {
  filters.forEach(filter => {
    const lastNode = filter.filterEffects[filter.filterEffects.length - 1];

    graph.setNode(filter.result, {width: WIDTH, height: HEIGHT});
    if(lastNode && lastNode.in !== undefined){
      graph.setEdge(lastNode.in, lastNode.result);
    }
    if(lastNode && lastNode.in2 !== undefined){
      graph.setEdge(lastNode.in2, lastNode.result);
    }
  });
};

export default function layout(filters){
  const graph = initGraph();
  setupGraph(graph, filters);
  dagre.layout(graph);

  const coords = filters.map((filter, index) => ({
    x:      0,
    y:      index * HEIGHT,
    width:  WIDTH,
    height: HEIGHT
  }));
  const bounds = graph.graph();

  filters.forEach(filter => {
    const node = graph.node(filter.result);
    filter.bounds = {
      x: node.x - node.width/2,
      y: node.y - node.height/2,
      width: node.width,
      height: node.height
    };
  });

  return {
    nodes: filters,
    edges: graph.edges().map(e => graph.edge(e)),
    bounds
  };
}
