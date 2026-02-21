import type Decimal from 'break_eternity.js';
import { player } from './player';
export const CurrencyKindObj = {
  matter: 'matter',
  deflator: 'deflator',
  deflationPower: 'deflationPower',
  overflowPoint: 'overflowPoint',
  helium: 'helium',
  energy: 'energy'
} as const;
export type CurrencyKind = typeof CurrencyKindObj[keyof typeof CurrencyKindObj];
export const CurrencyName={
  matter: "MT",
  deflator: "DF",
  deflationPower: "DP",
  overflowPoint: "OP",
  helium: "He",
  energy: "J"
} as const;
interface CurrencyConstData{
  kind: CurrencyKind
  name: string
}

export function setCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKindObj.matter:
      player.matter = v;
      break;
    case CurrencyKindObj.deflator:
      player.deflator = v;
      break;
    case CurrencyKindObj.deflationPower:
      player.deflationPower = v;
      break;
    case CurrencyKindObj.overflowPoint:
      player.overflowPoint = v;
      break;
    case CurrencyKindObj.helium:
      player.fusion.helium = v;
      break;
    case CurrencyKindObj.energy:
      player.fusion.energy = v;
      break;
    default:
      let leftover: never = currency;
      throw new TypeError(`Unknown CurrencyKind: ${leftover}`);
      break;
  }
}
export function getCurrency(currency: CurrencyKind) {
  switch (currency) {
    case CurrencyKindObj.matter:
      return player.matter;
    case CurrencyKindObj.deflator:
      return player.deflator
    case CurrencyKindObj.deflationPower:
      return player.deflationPower;
    case CurrencyKindObj.overflowPoint:
      return player.overflowPoint
    case CurrencyKindObj.helium:
      return player.fusion.helium
    case CurrencyKindObj.energy:
      return player.fusion.energy
    default:
      let leftover: never = currency;
      throw new TypeError(`Unknown CurrencyKind: ${leftover}`);
      break;
  }
}
export function addCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKindObj.matter:
      player.totalMatter = player.totalMatter.add(v);
      player.matter = player.matter.add(v);
      break;
    case CurrencyKindObj.deflator:
      player.deflator = player.deflator.add(v);
      break;
    case CurrencyKindObj.deflationPower:
      player.deflationPower = player.deflationPower.add(v);
      break;
    case CurrencyKindObj.overflowPoint:
      player.overflowPoint = player.overflowPoint.add(v);
      break;
    case CurrencyKindObj.helium:
      player.fusion.helium = player.fusion.helium.add(v);
      break;
    case CurrencyKindObj.energy:
      player.fusion.energy= player.fusion.energy.add(v);
      break;
    default:
      let leftover: never = currency;
      throw new TypeError(`Unknown CurrencyKind: ${leftover}`);
      break;
  }
}