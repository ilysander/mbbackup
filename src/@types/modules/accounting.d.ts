declare const module: any;

declare module "accounting" {
  export = module;
  export default module;
  export const settings: any;
  export const formatMoney: any;
}