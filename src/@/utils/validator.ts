export interface ValidatorFunction<T> {
  (value: T): string | null;
}

export type Validator<T> = {
  [K in keyof T]: Validator<T[K]> | ValidatorFunction<T[K]> | null;
};

export type Validation<T> = {
  [K in keyof T]: Validation<T[K]> | string | null;
};

const validate = <T extends Record<string, any>>(
  obj: T,
  v: Validator<T>
): Validation<T> => {
  const valueEntries = Object.entries(obj);
  if (valueEntries.length !== Object.keys(v).length) {
    throw new Error("Validator does not match object");
  }
  const validatedEntries = valueEntries.map(([key, value]) => {
    const validator = v[key];
    if (validator == null) return [key, null];
    if (isFunction(validator))
      return [key, (validator as ValidatorFunction<typeof value>)(value)];
    return [key, validate(value, validator as Validator<typeof value>)];
  });
  return Object.fromEntries(validatedEntries);
};

const isFunction = (toCheck: any) => {
  return toCheck && {}.toString.call(toCheck) === "[object Function]";
};

export default validate;
