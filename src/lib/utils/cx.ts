export const cx = (...classes: ([boolean, string, string?] | string)[]): string =>
  classes
    .map((className) => {
      if (!Array.isArray(className)) {
        return className;
      }
      const [condition, primaryClass, altClass = ''] = className;
      return condition ? primaryClass : altClass;
    })
    .join(' ');
