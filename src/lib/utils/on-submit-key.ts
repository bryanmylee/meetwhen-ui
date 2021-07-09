export const onSubmitKey = <T>(
  fn: (event: KeyboardEvent, ...args: T[]) => void
): ((event: KeyboardEvent, ...args: T[]) => void) => {
  return (event: KeyboardEvent, ...args: T[]) => {
    if (event.key === ' ' || event.key === 'Enter') {
      fn(event, ...args);
    }
  };
};
