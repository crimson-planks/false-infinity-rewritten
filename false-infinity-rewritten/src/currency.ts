import type Decimal from './lib/break_eternity';
import { player } from './player';
export enum CurrencyKind {
  Matter = 'matter',
  Deflator = 'deflator'
}
export function setCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKind.Matter:
      player.matter = v;
      break;
    case CurrencyKind.Deflator:
      player.deflator = v;
      break;
  }
}
export function getCurrency(currency: CurrencyKind) {
  switch (currency) {
    case CurrencyKind.Matter:
      return player.matter;
    case CurrencyKind.Deflator:
      return player.deflator
  }
}