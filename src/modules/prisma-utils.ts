export function excludeFromSingleObject<Obj, Key extends keyof Obj>(
  obj: Obj,
  keys: Key[]
): Omit<Obj, Key> {
  for (let key of keys) {
    delete obj[key];
  }
  return obj;
}

export function excludeFromArrayOfObjects(
  arr: Object[],
  keys: string[]
): Object[] {
  let newArr = [];
  for (let val of arr) {
    // @ts-expect-error
    newArr.push(excludeFromSingleObject(val, keys));
  }
  return newArr;
}
