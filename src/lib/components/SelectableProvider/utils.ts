export const idsWithAddedId = (ids: string[], toAdd: string): string[] => {
  if (ids.some((id) => id === toAdd)) {
    return ids;
  }
  return [...ids, toAdd];
};

export const idsWithoutRemovedId = (ids: string[], toRemove: string): string[] => {
  return ids.filter((id) => id !== toRemove);
};
