import Decimal from "break_eternity.js";

export type VERSION_TYPE = [number, number, number]
export const VERSION: VERSION_TYPE = [0,2,0]
export const VERSION_STR = VERSION.join('.');
export const N_AVOGADRO_NUMBER = 6.022_140_76e23;
export const D_AVOGADRO_NUMBER = new Decimal(N_AVOGADRO_NUMBER);
export const d1 = new Decimal(1)
export const d2 = new Decimal(2);
export const d4 = new Decimal(4)
export const d0_1 = new Decimal(0.1);
export const d0_5 = new Decimal(0.5)
export const d0_05 = new Decimal(0.05)
export const variables = {
  diffDecimal: new Decimal(0.05),
}