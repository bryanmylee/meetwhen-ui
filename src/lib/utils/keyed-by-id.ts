import type { Identifiable } from '$lib/gql/types/identifiable';

export const keyedById = <T extends Identifiable>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]));
