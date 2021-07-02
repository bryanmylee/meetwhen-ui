export const classes = (names: (string | false)[]): string =>
  names.filter((name) => name !== false).join(' ');
