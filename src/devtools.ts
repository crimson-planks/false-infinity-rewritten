import { BuyMaxInterval, BuyPossibleAutobuyer, getAutobuyerCostScaling, getAutobuyerInterval, getDeflationPowerAutobuyerIntervalDivideByDeflation, getIntervalCostScaling } from "./autobuyer";
import { BaseConvert, hyperscientifify, scientifify } from "eternal_notations";
import { FormatLex, formatValue, inequality_core, Integer_BaseConvertToDigitArray, NonInteger_BaseConvertToDigitArray, notations } from "./notation";
import { displayNumberAsBits, floorSlog10, floorSlog10_naive, nextNumber, pow10_accurate, viewNumber, viewNumberToNumber } from './decimal';
import { fixSave, load, mergeObj_nocopy, save, toStringifiableObject, toUsableObject } from "./saveload";
import { ExponentialCostScaling, LinearCostScaling, SumFunctionCostScaling } from "./cost";
import { getDefaultPlayer, setPlayer } from "./player";
import { displayError, FormatTime } from "./ui";
import { canDeflate, deflationReset, getDeflatorGainScaling, getOverflowLimit, getPossibleDeflateAmount, overflowReset } from "./prestige";
import { get_matterDecay_dueTo_fusion } from "./fusion";
import { variables } from "./constants";

export const game_devTools={
  fixSave,
  displayError,
  toStringifiableObject,
  toUsableObject,
  save,
  load,
  isPowLogSame(x: number){
    if(typeof x!== "number") return undefined;
    //also detect 0 and -0
    const rslt = Math.log10(Math.pow(10,x));
    if(Object.is(rslt,x)) return undefined;
    else return rslt;
  },
  pow10_accurate,
  displayNumberAsBits,
  viewNumber,
  viewNumberToNumber,
  nextNumber,
  getDefaultPlayer,
  setPlayer,
  getDeflationPowerAutobuyerIntervalDivideByDeflation,
  get_matterDecay_dueTo_fusion,
  getOverflowLimit,
  getDeflatorGainScaling,
  getAutobuyerInterval,
  BuyPossibleAutobuyer,
  BuyMaxInterval,
  getPossibleDeflateAmount,
  canDeflate,
  deflationReset,
  overflowReset,
  mergeObj_nocopy,
  LinearCostScaling,
  ExponentialCostScaling,
  SumFunctionCostScaling,
  getAutobuyerCostScaling,
  getIntervalCostScaling,
  BaseConvert,
  scientifify,
  hyperscientifify,
  floorSlog10_naive,
  floorSlog10,
  formatValue,
  FormatLex,
  FormatTime,
  Integer_BaseConvertToDigitArray,
  NonInteger_BaseConvertToDigitArray,
  inequality_core,
  notations
}