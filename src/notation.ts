import Decimal from './lib/break_eternity.js';
import { Presets } from './lib/eternal_notations.esm.js';
import { OVERFLOW } from './prestige.js';
export enum NotationName {
  Default = 'default',
  Scientific = 'scientific'
}
export function formatValue(inputValue: Decimal, notation: NotationName) {
  if(inputValue.isNan()) return "NaN"
  if(inputValue.gt(OVERFLOW)) return "Error: Overflow"
  switch (notation) {
    case NotationName.Default:
      return Presets.Default.formatDecimal(inputValue);
    case NotationName.Scientific:
      return Presets.Scientific.formatDecimal(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
