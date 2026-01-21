import type Decimal from './lib/break_eternity';
import { player } from './player';
export enum CurrencyKind {
  Matter = 'matter',
  Deflator = 'deflator',
  OverflowPoint = 'overflowPoint'
}
export const CurrencyName={
  matter: "MT",
  deflator: "DF",
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
    case CurrencyKind.OverflowPoint:
      return player.overflowPoint
  }
}