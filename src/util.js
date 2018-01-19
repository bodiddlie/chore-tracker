export function objectToArray(object) {
  let obj = object;

  if (obj === null || obj === undefined) {
    obj = {};
  }

  return Object.keys(obj).reduce((acc, cur) => {
    acc.push(obj[cur]);
    return acc;
  }, []);
}
