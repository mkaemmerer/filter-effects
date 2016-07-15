export const matchOn = key => cases => object => {
  const type = object[key];

  if(cases.hasOwnProperty(type)) {
    return cases[type](object);
  } else if(cases.hasOwnProperty('_')) {
    return cases['_'](object);
  } else {
    throw new Error(`Unmatched pattern: ${type}`);
  }
};

export const matchType = matchOn('type');

export default matchType;
