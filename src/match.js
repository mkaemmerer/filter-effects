export default function match(cases){
  return function(object){
    const type = object.type;

    if(cases.hasOwnProperty(type)) {
      return cases[type](object);
    } else if(cases.hasOwnProperty('_')) {
      return cases['_'](object);
    } else {
      throw new Error('Unmatched pattern');
    }
  };
}
