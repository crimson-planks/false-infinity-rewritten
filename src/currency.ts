import type Decimal from 'break_eternity.js';
import { player } from './player';
export enum CurrencyKind {
  Matter = 'matter',
  Deflator = 'deflator',
  DeflationPower = 'deflationPower',
  OverflowPoint = 'overflowPoint'
}
export const CurrencyName={
  matter: "MT",
  deflator: "DF",
  deflationPower: "DP",
  overflowPoint: "OP"
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
  }
}