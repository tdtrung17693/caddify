export type Maybe<T> = null | undefined | T;

export function runMaybe<T, R>(
  maybe: Maybe<T>,
  fn: (val: T) => Maybe<R>,
): Maybe<R> {
  if (!maybe) return;

  return fn(maybe);
}
