import type Decimal from 'break_eternity.js';
import { player } from './player';
export enum CurrencyKind {
  Matter = 'matter',
  Deflator = 'deflator',
  DeflationPower = 'deflationPower',
  OverflowPoint = 'overflowPoint',
  Helium = 'helium'
}
export const CurrencyName={
  matter: "MT",
  deflator: "DF",
  deflationPower: "DP",
  overflowPoint: "OP",
  helium: "He"
}
export function setCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKind.Matter:
      player.matter = v;
      break;
    case CurrencyKind.Deflator:
      player.deflator = v;
      break;
    case CurrencyKind.DeflationPower:
      player.deflationPower = v;
      break;
    case CurrencyKind.OverflowPoint:
      player.overflowPoint = v;
    case CurrencyKind.Helium:
      player.fusion.helium = v;
  }
}
export function getCurrency(currency: CurrencyKind) {
  switch (currency) {
    case CurrencyKind.Matter:
      return player.matter;
    case CurrencyKind.Deflator:
      return player.deflator
    case CurrencyKind.DeflationPower:
      return player.deflationPower;
    case CurrencyKind.OverflowPoint:
      return player.overflowPoint
    case CurrencyKind.Helium:
      return player.fusion.helium
  }
}
export function addCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKind.Matter:
      player.totalMatter = player.totalMatter.add(v);
      player.matter = player.matter.add(v);
      break;
    case CurrencyKind.Deflator:
      player.deflator = player.deflator.add(v);
      break;
    case CurrencyKind.DeflationPower:
      player.deflationPower = player.deflationPower.add(v);
      break;
    case CurrencyKind.OverflowPoint:
      player.overflowPoint = player.overflowPoint.add(v);
    case CurrencyKind.Helium:
      player.fusion.helium = player.fusion.helium.add(v);
  }
}