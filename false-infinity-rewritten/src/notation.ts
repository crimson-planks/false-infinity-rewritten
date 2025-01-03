import Decimal from './lib/break_eternity.js';
import { Presets } from './lib/eternal_notations.esm';
export enum NotationName {
  Default = 'default',
  Scientific = 'scientific'
}
export function formatValue(inputValue: Decimal, notation: NotationName) {
  switch (notation) {
    case NotationName.Default:
      return Presets.Default.formatDecimal(inputValue);
    case NotationName.Scientific:
      return Presets.Scientific.formatDecimal(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
