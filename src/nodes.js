import Free         from './free';
import FilterEffect from './filter-effect';

//Nodes
const liftF = cmd => Free.impure(cmd.map(Free.pure));
const id    = x => x;

const createNode = type => attrs => {
  const node = new FilterEffect({
    type,
    attrs,
    next: id
  });
  return liftF(node);
};

//Node types
export const feBlend             = createNode('feBlend');
export const feColorMatrix       = createNode('feColorMatrix');
export const feComponentTransfer = createNode('feComponentTransfer');
export const feComposite         = createNode('feComposite');
export const feConvolveMatrix    = createNode('feConvolveMatrix');
export const feDiffuseLighting   = createNode('feDiffuseLighting');
export const feDisplacementMap   = createNode('feDisplacementMap');
export const feFlood             = createNode('feFlood');
export const feFuncA             = createNode('feFuncA');
export const feFuncB             = createNode('feFuncB');
export const feFuncG             = createNode('feFuncG');
export const feFuncR             = createNode('feFuncR');
export const feGaussianBlur      = createNode('feGaussianBlur');
export const feImage             = createNode('feImage');
export const feMerge             = createNode('feMerge');
export const feMergeNode         = createNode('feMergeNode');
export const feMorphology        = createNode('feMorphology');
export const feOffset            = createNode('feOffset');
export const feSpecularLighting  = createNode('feSpecularLighting');
export const feTile              = createNode('feTile');
export const feTurbulence        = createNode('feTurbulence');
