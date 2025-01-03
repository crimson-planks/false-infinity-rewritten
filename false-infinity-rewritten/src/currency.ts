import type Decimal from './lib/break_eternity';
import { player } from './player';
export enum CurrencyKind {
  Matter = 'matter'
}
export function setCurrency(currency: CurrencyKind, v: Decimal) {
  switch (currency) {
    case CurrencyKind.Matter:
      player.matter = v;
  }
}
export function getCurrency(currency: CurrencyKind) {
  switch (currency) {
    case CurrencyKind.Matter:
      return player.matter;
  }
}