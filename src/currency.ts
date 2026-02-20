import type Decimal from 'break_eternity.js';
import { player } from './player';
export const CurrencyKindObj = {
  matter: 'matter',
  Deflator: 'deflator',
  DeflationPower: 'deflationPower',
  OverflowPoint: 'overflowPoint',
  Helium: 'helium',
  Energy: 'energy'
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
interface CurrencyOption{
  kind: CurrencyKind
  name: string
}

export function setCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKindObj.matter:
      player.matter = v;
      break;
    case CurrencyKindObj.Deflator:
      player.deflator = v;
      break;
    case CurrencyKindObj.DeflationPower:
      player.deflationPower = v;
      break;
    case CurrencyKindObj.OverflowPoint:
      player.overflowPoint = v;
      break;
    case CurrencyKindObj.Helium:
      player.fusion.helium = v;
      break;
    case CurrencyKindObj.Energy:
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
    case CurrencyKindObj.Deflator:
      return player.deflator
    case CurrencyKindObj.DeflationPower:
      return player.deflationPower;
    case CurrencyKindObj.OverflowPoint:
      return player.overflowPoint
    case CurrencyKindObj.Helium:
      return player.fusion.helium
    case CurrencyKindObj.Energy:
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
    case CurrencyKindObj.Deflator:
      player.deflator = player.deflator.add(v);
      break;
    case CurrencyKindObj.DeflationPower:
      player.deflationPower = player.deflationPower.add(v);
      break;
    case CurrencyKindObj.OverflowPoint:
      player.overflowPoint = player.overflowPoint.add(v);
      break;
    case CurrencyKindObj.Helium:
      player.fusion.helium = player.fusion.helium.add(v);
      break;
    case CurrencyKindObj.Energy:
      player.fusion.energy= player.fusion.energy.add(v);
      break;
    default:
      let leftover: never = currency;
      throw new TypeError(`Unknown CurrencyKind: ${leftover}`);
      break;
  }
}