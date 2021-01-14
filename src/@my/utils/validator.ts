export interface ValidatorFunction {
  (value: any): string | null;
}

export interface Validator {
  [key: string]: Validator | ValidatorFunction  | null;
}

export interface Validated {
  [key: string]: Validated | string | null;
}

const validate = (obj: Record<string, any>, v: Validator): Validated => {
  const valueEntries = Object.entries(obj);
  if (valueEntries.length !== Object.keys(v).length) {
    throw new Error('Validator does not match object');
  }
  const validatedEntries = valueEntries.map(([key, value]) => {
    const validator = v[key];
    if (validator == null) return [key, null];
    if (isFunction(validator)) return [key, (validator as ValidatorFunction)(value)];
    return [key, validate(value, validator as Validator)];
  });
  return Object.fromEntries(validatedEntries);
};

const isFunction = (toCheck: any) => {
  return toCheck && {}.toString.call(toCheck) === '[object Function]';
}

export default validate;

