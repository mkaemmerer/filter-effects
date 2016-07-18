import Free from './free';

const cached = f => {
  let value = undefined;
  return x => {
    if(value === undefined){
      value = f(x);
    }
    return value;
  };
};

const Monad = {
  do: gen => {
    const g    = gen();
    const step = data => {
      const {done, value} = g.next(data);
      return done ? value : value.flatMap(cached(step));
    };
    return step();
  },
  of: Free.pure
};

export default Monad;
