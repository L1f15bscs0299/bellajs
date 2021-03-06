/**
 * bellajs
 * @ndaidong
**/

import {
  isObject,
  isArray,
  isDate,
  hasProperty,
} from './utils/detection';

export const curry = (fn) => {
  const totalArguments = fn.length;
  const next = (argumentLength, rest) => {
    if (argumentLength > 0) {
      return (...args) => {
        return next(argumentLength - args.length, [...rest, ...args]);
      };
    }
    return fn(...rest);
  };
  return next(totalArguments, []);
};

export const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)));
};

export const pipe = (...fns) => {
  return fns.reduce((f, g) => (x) => g(f(x)));
};


export const clone = (val) => {
  if (isDate(val)) {
    return new Date(val.valueOf());
  }

  const copyObject = (o) => {
    const oo = Object.create({});
    for (const k in o) {
      if (hasProperty(o, k)) {
        oo[k] = clone(o[k]);
      }
    }
    return oo;
  };

  const copyArray = (a) => {
    return [...a].map((e) => {
      if (isArray(e)) {
        return copyArray(e);
      } else if (isObject(e)) {
        return copyObject(e);
      }
      return clone(e);
    });
  };

  if (isArray(val)) {
    return copyArray(val);
  }

  if (isObject(val)) {
    return copyObject(val);
  }

  return val;
};


export const copies = (source, dest, matched = false, excepts = []) => {
  for (const k in source) {
    if (excepts.length > 0 && excepts.includes(k)) {
      continue; // eslint-disable-line no-continue
    }
    if (!matched || matched && hasProperty(dest, k)) {
      const oa = source[k];
      const ob = dest[k];
      if (isObject(ob) && isObject(oa) || isArray(ob) && isArray(oa)) {
        dest[k] = copies(oa, dest[k], matched, excepts);
      } else {
        dest[k] = clone(oa);
      }
    }
  }
  return dest;
};

export const unique = (arr = []) => {
  return [...new Set(arr)];
};

export const sort = (fn, arr = []) => {
  return [...arr].sort(fn);
};

export const sortBy = (key, order = 1, arr = []) => {
  return sort(arr, (m, n) => {
    return m[key] > n[key] ? order : (m[key] < n[key] ? (-1 * order) : 0);
  });
};

export const shuffle = (arr = []) => {
  return sort(() => {
    return Math.random() > 0.5;
  }, [...arr]);
};

export const pick = (count = 1, arr = []) => {
  const a = shuffle([...arr]);
  const mc = Math.max(1, count);
  const c = Math.min(mc, a.length - 1);
  return a.splice(0, c);
};

export * from './utils/detection';
export * from './utils/equals';
export * from './utils/string';
export * from './utils/random';
export * from './utils/date';
export * from './utils/md5';
