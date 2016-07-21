const WIDTH  = 150;
const HEIGHT = 100;

export default function layout(graph){
  const coords = graph.map((node, index) => ({
    x:      0,
    y:      index * HEIGHT,
    width:  WIDTH,
    height: HEIGHT
  }));
  const bounds = {
    width:  Math.max(...coords.map(c => c.x)) + WIDTH,
    height: Math.max(...coords.map(c => c.y)) + HEIGHT
  };

  graph.forEach((node, index) => {
    node.bounds = coords[index];
  });

  return {
    graph,
    bounds
  };
}
