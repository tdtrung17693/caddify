export function partitionBy<T, R extends keyof T = keyof T>(
  items: T[],
  field: R,
): { [P in string & T[R]]: T[] } {
  const map = {} as any;
  items.forEach((item) => {
    const key = item[field];
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
  });
  return map;
}
