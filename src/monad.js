import Free from './free';

const Monad = {
  do: gen => {
    const g    = gen();
    const step = data => {
      const {done, value} = g.next(data);
      return done ? value : value.flatMap(step);
    };
    return step();
  },
  of: Free.pure
};

export default Monad;
