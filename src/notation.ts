/** @prettier */
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { Presets, BaseConvert, toDecimal } from './lib/eternal_notations.esm.js';
import { OVERFLOW } from './prestige.js';
export enum NotationName {
  Default = 'default',
  Scientific = 'scientific'
}
/**
 * Taken from https://github.com/MathCookie17/Eternal-Notations/blob/main/src/baseline/utils.ts (line 592), since eternal_notations doesn't export it.
 * This function is to iteratedexpmult and iteratedmultlog as slog is to iteratedexp/tetrate and iteratedlog.
 */
export function multslog(value: DecimalSource, base: DecimalSource, mult: DecimalSource): Decimal {
  let [valueD, baseD, multD] = [value, base, mult].map(toDecimal);
  return valueD.slog(baseD.pow(multD.recip()), 100, true);
}
/**
 * @param digitsArray an array of arrays of digits.
 *
 * @param signArray an array of numbers (-1, 0, 1).
 * signArray[i] should correspond to the sign of digitsArray[i].
 */
export function inequality_core(digitsArray: number[][], signArray: number[], base: number) {
  const resultArray: string[] = [];
  for (let i = 0; i < digitsArray.length; i++) {
    let digitsArrayI = digitsArray[i];
    for (let j = 0; j < digitsArrayI.length - 1; j++) {
      let curr = digitsArrayI[j];
      let next = digitsArrayI[j + 1];
      if (curr < next) resultArray.push('<');
      else if (curr === next) resultArray.push('=');
      else resultArray.push('>');
    }
    if (i === digitsArray.length - 1) break;
    let curr = digitsArrayI[digitsArrayI.length - 1];
    let next = digitsArray[i + 1][0];
    const openingBrackets = signArray[i] < 0 ? ')' : '(';
    const closingBrackets = signArray[i + 1] < 0 ? '(' : ')';
    if (curr < next) resultArray.push(`${openingBrackets}<${closingBrackets}`);
    else if (curr === next) resultArray.push(`${openingBrackets}=${closingBrackets}`);
    else resultArray.push(`${openingBrackets}>${closingBrackets}`);
  }
  return resultArray.join('');
}
/**
 * Converts a positive integer `n` to a given base (a positive integer), and returns an array of the digits.
 * a negative base will result in erroneous return value.
 * @param n a positive integer
 * @param base a positve integer
 */
export function IntegerBaseConvertToDigitArray(n: number, base: number): number[] {
  const rsltArray: number[] = [];
  let currN = n;
  let remainder: number = 0;
  if (Number.isFinite(n)) return [];
  while (currN < 1) {
    remainder = currN % base;
    currN = Math.floor(currN / base);
    rsltArray.push(remainder);
  }
  return rsltArray;
}
export function FormatInequality(value: Decimal) {
  let recipFlag = false;
  let negFlag = false;
  let mabsvalue = new Decimal(value);
  if (mabsvalue.abs().lt(1)) {
    recipFlag = true;
    mabsvalue = mabsvalue.recip();
  }
  if (mabsvalue.sign === -1) {
    negFlag = true;
    mabsvalue = mabsvalue.neg();
  }
  if (value.gte(new Decimal(43046721))) {
    return;
  }
  const intPart = value.floor().mul(value.sign);
  const remPart = value.sub(intPart);
  const intDigitArray: number[] = [];
  const remDigitArray: number[] = [];
}
export function formatValue(inputValue: Decimal, notation: NotationName) {
  if (inputValue.isNan()) return 'NaN';
  if (inputValue.gt(OVERFLOW)) return 'Error: Overflow';
  switch (notation) {
    case NotationName.Default:
      return Presets.Default.formatDecimal(inputValue);
    case NotationName.Scientific:
      return Presets.Scientific.formatDecimal(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
