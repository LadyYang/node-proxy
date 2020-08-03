export const compose = (...funs: Function[]) => {
  if (funs.length === 0) {
    return (args: any) => args;
  }

  if (funs.length === 1) {
    return funs[0];
  }

  return (...args: any[]) => {
    let result: any;
    for (let i = funs.length - 1; i >= 0; i--) {
      if (i === funs.length - 1) {
        result = funs[i](...args);
      } else {
        result = funs[i](result);
      }
    }

    return result;
  };
};
