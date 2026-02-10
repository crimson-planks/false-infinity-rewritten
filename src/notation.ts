/** @prettier */
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { Presets, BaseConvert, toDecimal, Notation } from 'eternal_notations';
import { OVERFLOW } from './prestige.js';
export enum NotationIdEnum {
  Default = 'default',
  Scientific = 'scientific',
  Logarithm = 'logarithm',
  Inequality = 'inequality'
}
export type NotationId = 'default' | 'scientific' | 'logarithm' | 'inequality';
export const notationArray = [
  NotationIdEnum.Default,
  NotationIdEnum.Scientific,
  NotationIdEnum.Logarithm,
  NotationIdEnum.Inequality
];
/**
 * from https://github.com/MathCookie17/Eternal-Notations/blob/main/src/presets.ts
 * */
function defaultRound(value: Decimal) {
  if (value.eq(0)) return new Decimal(0);
  return value.abs().log10().floor().sub(3).pow_base(10).min(1);
}
/**
 * @param digitsArray an array of arrays of digits.
 *
 * @param signArray an array of numbers (-1, 0, 1).
 * signArray[i] should correspond to the sign of digitsArray[i].
 * @param lessThanStr string when current digit < next digit. Defaults to `'<'`
 * @param equalToStr string when current digit = next digit. Defaults to `'-'`
 * @param greaterThanStr string when current digit = next digit. Defaults to `'>'`
 * @param positiveClosingBracket string when sign
 */
export function inequality_core(
  digitsArray: number[][],
  signArray: number[],
  lessThanStr: string = '<',
  equalToStr: string = '=',
  greaterThanStr: string = '>',
  positiveOpeningBracket: string = '(',
  negativeOpeningBracket: string = ')',
  positiveClosingBracket: string = ')',
  negativeClosingBracket: string = '('
) {
  const resultArray: string[] = [];
  for (let i = 0; i < digitsArray.length; i++) {
    let digitsArrayI = digitsArray[i];
    for (let j = 0; j < digitsArrayI.length - 1; j++) {
      let curr = digitsArrayI[j];
      let next = digitsArrayI[j + 1];
      if (curr < next) resultArray.push(lessThanStr);
      else if (curr === next) resultArray.push(equalToStr);
      else resultArray.push(greaterThanStr);
    }
    if (i === digitsArray.length - 1) break;
    let curr = digitsArrayI[digitsArrayI.length - 1];
    let next = digitsArray[i + 1][0];
    const openingBrackets = signArray[i] < 0 ? negativeOpeningBracket : positiveOpeningBracket;
    const closingBrackets = signArray[i + 1] < 0 ? negativeClosingBracket : positiveClosingBracket;
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
 * @param base a positive integer
 */
export function IntegerBaseConvertToDigitArray(n: number, base: number): number[] {
  const rsltArray: number[] = [];
  let currN = n;
  let remainder: number = 0;
  if (!Number.isFinite(n)) return [];
  if (n === 0) return [0];
  while (currN >= 1) {
    remainder = currN % base;
    currN = Math.floor(currN / base);
    rsltArray.push(remainder);
  }
  return rsltArray.reverse();
}
export function NonInteger_BaseConverToDigit(n: number, base: number, numDigits: number): number[] {
  const rsltArray: number[] = [];
  let currN = n;
  let intPart: number = 0;
  if (n >= 1) return [];
  for (let i = 0; i < numDigits; i++) {
    intPart = Math.floor(currN * base);
    currN = currN * base - intPart;
    rsltArray.push(intPart);
  }
  /*rounding
  if (currN >= 1 / 2 - 1e-10) rsltArray[numDigits - 1]++;
  for (let i = numDigits - 1; i >= 1; i--) {
    if (rsltArray[i] >= base) {
      rsltArray[i] -= base;
      rsltArray[i - 1]++;
    }
  }
  */
  return rsltArray;
}
/**
 * Inequality Notation.
 * @param value
 * @param base
 * @param rounding
 * @param manRounding
 * @param superExpRounding
 * @param lessThanStr
 * @param equalToStr
 * @param greaterThanStr
 * @param positiveOpeningBracket
 * @param negativeOpeningBracket
 * @param positiveClosingBracket
 * @param negativeClosingBracket
 */
export function FormatInequality(
  value: Decimal,
  base: number,
  rounding: Decimal = Decimal.pow(base, 4),
  manRounding: Decimal = Decimal.fromDecimal(rounding),
  superExpRounding: number = Math.pow(base, 4),
  lessThanStr: string = '<',
  equalToStr: string = '=',
  greaterThanStr: string = '>',
  positiveOpeningBracket: string = '(',
  negativeOpeningBracket: string = ')',
  positiveClosingBracket: string = ')',
  negativeClosingBracket: string = '('
) {
  let recipFlag = false;
  let negFlag = false;
  let layerSign = 1;
  let magSign = 1;

  let mabsvalue = new Decimal(value);
  if (mabsvalue.neq(0) && mabsvalue.abs().lt(1)) {
    recipFlag = true;
    mabsvalue = mabsvalue.recip();
    layerSign = -1;
  }
  if (mabsvalue.sign === -1) {
    negFlag = true;
    mabsvalue = mabsvalue.neg();
    magSign = -1;
  }
  if (value.neq(0) && (value.abs().lte(rounding.recip()) || mabsvalue.gte(Decimal.pow(base, 16)))) {
    const layer = mabsvalue
      .slog(base, 100, true)
      .sub(new Decimal(16).slog(3, 100, true))
      .floor()
      .toNumber();
    const mag = mabsvalue.iteratedlog(base, layer, true);
    const roundedMag = mag.mul(manRounding).round().div(manRounding);
    const magIntPart = roundedMag.floor();
    const magResPart = roundedMag.sub(magIntPart);
    const magIntDigitArray = IntegerBaseConvertToDigitArray(magIntPart.toNumber(), base).map(
      (v) => v * magSign
    );
    const magResDigitArray = NonInteger_BaseConverToDigit(magResPart.toNumber(), base, 4).map(
      (v) => v * magSign
    );
    if (layer >= Math.pow(3, 16)) {
      const logLayer = Math.log2(layer) / Math.log2(base);
      const roundedLogLayer = Math.round(logLayer * superExpRounding) / superExpRounding;
      const logLayerIntPart = Math.floor(roundedLogLayer);
      const logLayerResPart = roundedLogLayer - logLayerIntPart;
      const logLayerIntDigitArray = IntegerBaseConvertToDigitArray(logLayerIntPart, base).map(
        (v) => v * layerSign
      );
      const logLayerResDigitArray = NonInteger_BaseConverToDigit(logLayerResPart, base, 4).map(
        (v) => v * layerSign
      );
      return inequality_core(
        [logLayerIntDigitArray, logLayerResDigitArray, magIntDigitArray, magResDigitArray],
        [layerSign, layerSign, magSign, magSign],
        lessThanStr,
        equalToStr,
        greaterThanStr,
        positiveOpeningBracket,
        negativeOpeningBracket,
        positiveClosingBracket,
        negativeClosingBracket
      );
    }
    const layerDigitArray: number[] = IntegerBaseConvertToDigitArray(layer, base).map(
      (v) => v * layerSign
    );
    return inequality_core(
      [layerDigitArray, magIntDigitArray, magResDigitArray],
      [layerSign, magSign, magSign]
    );
  } else {
    const roundedAbsValue = value.abs().mul(rounding).round().div(rounding);
    const intPart = roundedAbsValue.floor();
    const remPart = roundedAbsValue.sub(intPart);
    const intDigitArray: number[] = IntegerBaseConvertToDigitArray(intPart.toNumber(), base).map(
      (v) => v * magSign
    );
    const remDigitArray: number[] = NonInteger_BaseConverToDigit(remPart.toNumber(), base, 4).map(
      (v) => v * magSign
    );
    return inequality_core(
      [intDigitArray, remDigitArray],
      [magSign, magSign],
      lessThanStr,
      equalToStr,
      greaterThanStr,
      positiveOpeningBracket,
      negativeOpeningBracket,
      positiveClosingBracket,
      negativeClosingBracket
    );
  }
}
/**
 * @param base
 * @param rounding
 * @param manRounding
 * @param superExpRounding
 * @param inequalityChars
 * @param inBetweenChars An pair of pairs of strings that are used as the between characters for inequality notation. The first pair is when the corresponding section is positive or zero, and the second pair is when the corresponding section is negative. In each pair, the first entry goes between the previous section and the sign, and the second entry goes between the sign and the next section.
 */
export class InequalityNotation extends Notation {
  private base: number;
  private rounding: Decimal;
  private manRounding: Decimal;
  private superExpRounding: number;
  private inequalityChars: [string, string, string];
  private inBetweenChars: [[string, string], [string, string]];
  constructor(
    base: number,
    rounding: Decimal = Decimal.pow(base, 4),
    manRounding: Decimal = Decimal.fromDecimal(rounding),
    superExpRounding: number = Math.pow(base, 4),
    inequalityChars: [string, string, string] = ['<', '=', '>'],
    inBetweenChars: [[string, string], [string, string]] = [
      ['(', ')'],
      [')', '(']
    ]
  ) {
    super();
    this.infinityString = inBetweenChars[0][0] + inBetweenChars[0][1];
    this.negativeInfinityString = inBetweenChars[1][0] + inBetweenChars[1][1];
    this.NaNString =
      inBetweenChars[0][0] +
      inBetweenChars[1][0] +
      inequalityChars.join('') +
      inBetweenChars[0][1] +
      inBetweenChars[1][1];

    this.base = base;
    this.rounding = rounding;
    this.manRounding = manRounding;
    this.superExpRounding = superExpRounding;
    this.inequalityChars = inequalityChars;
    this.inBetweenChars = inBetweenChars;
  }
  public name = 'Inequality Notation';
  public formatNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.neg());
  }
  public formatDecimal(value: Decimal): string {
    let recipFlag = false;
    let negFlag = false;
    let layerSign = 1;
    let magSign = 1;

    let mabsvalue = new Decimal(value);
    if (mabsvalue.neq(0) && mabsvalue.abs().lt(1)) {
      recipFlag = true;
      mabsvalue = mabsvalue.recip();
      layerSign = -1;
    }
    if (mabsvalue.sign === -1) {
      negFlag = true;
      mabsvalue = mabsvalue.neg();
      magSign = -1;
    }
    if (
      value.neq(0) &&
      (value.abs().lte(this.rounding.recip()) || mabsvalue.gte(Decimal.pow(this.base, 16)))
    ) {
      const layer = mabsvalue
        .slog(this.base, 100, true)
        .sub(new Decimal(16).slog(3, 100, true))
        .floor()
        .toNumber();
      const mag = mabsvalue.iteratedlog(this.base, layer, true);
      const roundedMag = mag.mul(this.manRounding).round().div(this.manRounding);
      const magIntPart = roundedMag.floor();
      const magResPart = roundedMag.sub(magIntPart);
      const magIntDigitArray = IntegerBaseConvertToDigitArray(magIntPart.toNumber(), this.base).map(
        (v) => v * magSign
      );
      const magResDigitArray = NonInteger_BaseConverToDigit(
        magResPart.toNumber(),
        this.base,
        4
      ).map((v) => v * magSign);
      if (layer >= Math.pow(3, 16)) {
        const logLayer = Math.log2(layer) / Math.log2(this.base);
        const roundedLogLayer =
          Math.round(logLayer * this.superExpRounding) / this.superExpRounding;
        const logLayerIntPart = Math.floor(roundedLogLayer);
        const logLayerResPart = roundedLogLayer - logLayerIntPart;
        const logLayerIntDigitArray = IntegerBaseConvertToDigitArray(
          logLayerIntPart,
          this.base
        ).map((v) => v * layerSign);
        const logLayerResDigitArray = NonInteger_BaseConverToDigit(
          logLayerResPart,
          this.base,
          4
        ).map((v) => v * layerSign);
        return inequality_core(
          [logLayerIntDigitArray, logLayerResDigitArray, magIntDigitArray, magResDigitArray],
          [layerSign, layerSign, magSign, magSign],
          this.inequalityChars[0],
          this.inequalityChars[1],
          this.inequalityChars[2],
          this.inBetweenChars[0][0],
          this.inBetweenChars[1][0],
          this.inBetweenChars[0][1],
          this.inBetweenChars[1][1]
        );
      }
      const layerDigitArray: number[] = IntegerBaseConvertToDigitArray(layer, this.base).map(
        (v) => v * layerSign
      );
      return inequality_core(
        [layerDigitArray, magIntDigitArray, magResDigitArray],
        [layerSign, magSign, magSign]
      );
    } else {
      const roundedAbsValue = value.abs().mul(this.rounding).round().div(this.rounding);
      const intPart = roundedAbsValue.floor();
      const remPart = roundedAbsValue.sub(intPart);
      const intDigitArray: number[] = IntegerBaseConvertToDigitArray(
        intPart.toNumber(),
        this.base
      ).map((v) => v * magSign);
      const remDigitArray: number[] = NonInteger_BaseConverToDigit(
        remPart.toNumber(),
        this.base,
        4
      ).map((v) => v * magSign);
      return inequality_core(
        [intDigitArray, remDigitArray],
        [magSign, magSign],
        this.inequalityChars[0],
        this.inequalityChars[1],
        this.inequalityChars[2],
        this.inBetweenChars[0][0],
        this.inBetweenChars[1][0],
        this.inBetweenChars[0][1],
        this.inBetweenChars[1][1]
      );
    }
  }
  public format(value: DecimalSource): string {
    let decimal = toDecimal(value);

    if (decimal.isNan()) return this.NaNString;

    if (this.isInfinite(decimal)) return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite;

    if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
      return this.format(0);
    }
    //inequality has representations for negative numbers
    return this.formatDecimal(decimal);
  }
}
export const notations = {
  default: Presets.Default.setNotationGlobals(undefined, undefined, undefined, 'NaN', undefined),
  scientific: Presets.Scientific.setNotationGlobals(
    undefined,
    undefined,
    undefined,
    'NaN',
    undefined
  ),
  logarithm: Presets.Logarithm.setNotationGlobals(
    undefined,
    undefined,
    undefined,
    'NaN',
    undefined
  ),
  inequality: new InequalityNotation(
    3,
    undefined,
    undefined,
    undefined,
    ['<', '=', '>'],
    [
      ['(', ')'],
      [')', '(']
    ]
  )
};
export function formatValue(inputValue: Decimal, notation: string) {
  //if (inputValue.isNan()) return 'NaN';
  if (inputValue.gt(OVERFLOW)) return 'Error: Overflow';
  switch (notation) {
    case NotationIdEnum.Default:
      return notations.default.format(inputValue);
    case NotationIdEnum.Scientific:
      return notations.scientific.format(inputValue);
    case NotationIdEnum.Logarithm:
      return notations.logarithm.format(inputValue);
    case NotationIdEnum.Inequality:
      return notations.inequality.format(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
