export type Action<Params> = (
  node: HTMLElement,
  params?: Params
) => {
  update?: (newParams?: Params) => void;
  destroy?: () => void;
} | void;
