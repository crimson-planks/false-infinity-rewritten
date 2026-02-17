/** @prettier */
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { Presets, BaseConvert, toDecimal, Notation } from 'eternal_notations';
import { OVERFLOW } from './prestige.js';
export enum NotationIdEnum {
  Default = 'default',
  Scientific = 'scientific',
  Logarithm = 'logarithm',
  Inequality = 'inequality',
  BinaryInequality = 'binaryInequality'
}
export type NotationId = NotationIdEnum.Default | NotationIdEnum.Scientific | NotationIdEnum.Logarithm | NotationIdEnum.Inequality | NotationIdEnum.BinaryInequality
export const notationArray = [
  NotationIdEnum.Default,
  NotationIdEnum.Scientific,
  NotationIdEnum.Logarithm,
  NotationIdEnum.Inequality,
  NotationIdEnum.BinaryInequality
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
 * @param positiveOpeningBracket
 * @param negativeOpeningBracket
 * @param positiveClosingBracket
 * @param negativeClosingBracket
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
export function IntegerBase_ConvertToDigitArray(n: number, base: number): number[] {
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
export function NonIntegerBase_ConvertToDigitArray(n: number, base: number, numDigits: number): number[] {
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
 * @deprecated Use `InequalityNotation` instead
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
    const magIntDigitArray = IntegerBase_ConvertToDigitArray(magIntPart.toNumber(), base).map(
      (v) => v * magSign
    );
    const magResDigitArray = NonIntegerBase_ConvertToDigitArray(magResPart.toNumber(), base, 4).map(
      (v) => v * magSign
    );
    if (layer >= Math.pow(3, 16)) {
      const logLayer = Math.log2(layer) / Math.log2(base);
      const roundedLogLayer = Math.round(logLayer * superExpRounding) / superExpRounding;
      const logLayerIntPart = Math.floor(roundedLogLayer);
      const logLayerResPart = roundedLogLayer - logLayerIntPart;
      const logLayerIntDigitArray = IntegerBase_ConvertToDigitArray(logLayerIntPart, base).map(
        (v) => v * layerSign
      );
      const logLayerResDigitArray = NonIntegerBase_ConvertToDigitArray(logLayerResPart, base, 4).map(
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
    const layerDigitArray: number[] = IntegerBase_ConvertToDigitArray(layer, base).map(
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
    const intDigitArray: number[] = IntegerBase_ConvertToDigitArray(intPart.toNumber(), base).map(
      (v) => v * magSign
    );
    const remDigitArray: number[] = NonIntegerBase_ConvertToDigitArray(remPart.toNumber(), base, 4).map(
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
 * Inequality Notation.
 * @param base
 * @param rounding
 * @param manRounding
 * @param superExpRounding
 * @param inequalityChars
 * @param inBetweenChars [[positiveOpeningBracket, positiveClosingBracket], [negativeOpeningBracket, negativeClosingBracket]].
 * An pair of pairs of strings that are used as the between characters for inequality notation. The first pair is when the corresponding section is positive or zero, and the second pair is when the corresponding section is negative. In each pair, the first entry goes between the previous section and the sign, and the second entry goes between the sign and the next section.
 */
export class InequalityNotation extends Notation {
  private _base: number;
  public decimalPlaces: number;
  public rounding: Decimal;
  public manRounding: Decimal;
  public superExpRounding: number;
  public inequalityChars: [string, string, string];
  public inBetweenChars: [[string, string], [string, string]];
  constructor(
    base: number,
    decimalPlaces: number,
    rounding: Decimal = new Decimal(Math.pow(base, decimalPlaces)),
    manRounding: Decimal = Decimal.fromDecimal(rounding),
    superExpRounding: number = Math.pow(base, decimalPlaces),
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

    this._base = base;
    this.decimalPlaces = decimalPlaces;
    this.rounding = rounding;
    this.manRounding = manRounding;
    this.superExpRounding = superExpRounding;
    this.inequalityChars = inequalityChars;
    this.inBetweenChars = inBetweenChars;
  }
  public get base() {
    return this._base;
  }
  public set base(base: number) {
    if (base < 1) throw RangeError('base < 1 in Inequality Notation');
    if (!Number.isInteger(base)) throw new RangeError('Non-integer base in Inequality Notation');
    this._base = base;
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
      (value.abs().lte(this.rounding.recip()) || mabsvalue.gte(Decimal.pow(this._base, 16)))
    ) {
      const layer = mabsvalue
        .slog(this._base, 100, true)
        .sub(new Decimal(16).slog(3, 100, true))
        .floor()
        .toNumber();
      const mag = mabsvalue.iteratedlog(this._base, layer, true);
      const roundedMag = mag.mul(this.manRounding).round().div(this.manRounding);
      const magIntPart = roundedMag.floor();
      const magResPart = roundedMag.sub(magIntPart);
      const magIntDigitArray = IntegerBase_ConvertToDigitArray(
        magIntPart.toNumber(),
        this._base
      ).map((v) => v * magSign);
      const magResDigitArray = NonIntegerBase_ConvertToDigitArray(
        magResPart.toNumber(),
        this._base,
        this.decimalPlaces
      ).map((v) => v * magSign);
      if (layer >= Math.pow(3, 16)) {
        const logLayer = Math.log2(layer) / Math.log2(this._base);
        const roundedLogLayer =
          Math.round(logLayer * this.superExpRounding) / this.superExpRounding;
        const logLayerIntPart = Math.floor(roundedLogLayer);
        const logLayerResPart = roundedLogLayer - logLayerIntPart;
        const logLayerIntDigitArray = IntegerBase_ConvertToDigitArray(
          logLayerIntPart,
          this._base
        ).map((v) => v * layerSign);
        const logLayerResDigitArray = NonIntegerBase_ConvertToDigitArray(
          logLayerResPart,
          this._base,
          this.decimalPlaces
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
      const layerDigitArray: number[] = IntegerBase_ConvertToDigitArray(layer, this._base).map(
        (v) => v * layerSign
      );
      return inequality_core(
        [layerDigitArray, magIntDigitArray, magResDigitArray],
        [layerSign, magSign, magSign],
        this.inequalityChars[0],
        this.inequalityChars[1],
        this.inequalityChars[2],
        this.inBetweenChars[0][0],
        this.inBetweenChars[1][0],
        this.inBetweenChars[0][1],
        this.inBetweenChars[1][1]
      );
    } else {
      const roundedAbsValue = value.abs().mul(this.rounding).round().div(this.rounding);
      const intPart = roundedAbsValue.floor();
      const remPart = roundedAbsValue.sub(intPart);
      const intDigitArray: number[] = IntegerBase_ConvertToDigitArray(
        intPart.toNumber(),
        this._base
      ).map((v) => v * magSign);
      const remDigitArray: number[] = NonIntegerBase_ConvertToDigitArray(
        remPart.toNumber(),
        this._base,
        this.decimalPlaces
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
export function FormatMufano(value: Decimal){
  const bc = (v:Decimal)=>BaseConvert(v.toNumber(),10,3,-4,0,-1,-1)
  if(value.lt(0)) return '-' //doesn't support negative numbers
  if(value.lt(1e-7)) return '/' //doesn't support negative exponents
  if(value.lt(10)) return bc(value)
  if(value.lt(100)) return `a${bc(value)}`
  if(value.lt(1000)) return `b${bc(value)}`
  if(value.lt(10000)) return `c${bc(value)}`
  if(value.lt(100000)) return `d${bc(value)}`
  if(value.lt("1e300")) {
    const exp = value.log10().floor()
    const mantissa = value.div(exp.pow10())
    const manStr = BaseConvert(mantissa.toNumber(),10,3,undefined,undefined,-1,undefined,undefined,undefined,undefined,'')
    return `e${exp.toString().padStart(3,'0')}_${manStr}`
  }
  else return "p"
}
export const notations = {
  default: Presets.Default.setNotationGlobals(...[,,,], 'NaN'),
  scientific: Presets.Scientific.setNotationGlobals(
    ...[,,,], 'NaN'
  ),
  logarithm: Presets.Logarithm.setNotationGlobals(
    ...[,,,], 'NaN'
  ),
  inequality: new InequalityNotation(
    3,
    4,
    undefined,
    undefined,
    undefined,
    ['<', '=', '>'],
    [
      ['(', ')'],
      [')', '(']
    ]
  ).setName('Inequality'),
  binaryInequality: new InequalityNotation(
    2,
    6,
    undefined,
    undefined,
    undefined,
    ['<', '=', '>'],
    [
      ['(', ')'],
      [')', '(']
    ]
  ).setName('Binary Inequality')
};
const HTMLnotations = {default: notations.default,
  scientific:notations.scientific,
  logarithm: notations.logarithm,
  inequality: new InequalityNotation(
    3,
    4,
    undefined,
    undefined,
    undefined,
    ['&lt;', '=', '&gt;'],
    [
      ['(', ')'],
      [')', '(']
    ]
  ).setName('Inequality'),
  binaryInequality: new InequalityNotation(
    2,
    6,
    undefined,
    undefined,
    undefined,
    ['&lt;', '=', '&gt;'],
    [
      ['(', ')'],
      [')', '(']
    ]
  ).setName('Binary Inequality')
}
export function formatValue(inputValue: DecimalSource, notation: string) {
  //if (inputValue.isNan()) return 'NaN';
  if (Decimal.gt(inputValue,OVERFLOW)) return 'Error: Overflow';
  switch (notation) {
    case NotationIdEnum.Default:
      return notations.default.format(inputValue);
    case NotationIdEnum.Scientific:
      return notations.scientific.format(inputValue);
    case NotationIdEnum.Logarithm:
      return notations.logarithm.format(inputValue);
    case NotationIdEnum.Inequality:
      return notations.inequality.format(inputValue);
    case NotationIdEnum.BinaryInequality:
      return notations.binaryInequality.format(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
