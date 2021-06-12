declare module 'style-css' {
  type ToCss = (style: Record<string, string>) => string;
  const toCss: ToCss;
  export default toCss;
}