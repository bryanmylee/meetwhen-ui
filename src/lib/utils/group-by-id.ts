import type { Identifiable } from '$lib/gql/types/identifiable';

export const groupById = <T extends Identifiable>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]));
