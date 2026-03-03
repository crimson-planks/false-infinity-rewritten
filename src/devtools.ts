import { BuyMaxInterval, getAutobuyerCostScaling, getIntervalCostScaling } from "./autobuyer";
import { BaseConvert, hyperscientifify, scientifify } from "eternal_notations";
import { FormatMufano, inequality_core, Integer_BaseConvertToDigitArray, mufano_pStartValue, NonInteger_BaseConvertToDigitArray, notations } from "./notation";
import { floorSlog10, floorSlog10_naive } from './decimal';
import { fixSave, load, mergeObj_nocopy, save, toStringifiableObject, toUsableObject } from "./saveload";
import { ExponentialCostScaling, LinearCostScaling } from "./cost";
import { getDefaultPlayer, setPlayer } from "./player";
import { displayError } from "./ui";

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
  getDefaultPlayer,
  setPlayer,
  BuyMaxInterval,
  mergeObj_nocopy,
  LinearCostScaling,
  ExponentialCostScaling,
  getAutobuyerCostScaling,
  getIntervalCostScaling,
  BaseConvert,
  scientifify,
  hyperscientifify,
  floorSlog10_naive,
  floorSlog10,
  mufano_pStartValue,
  FormatMufano,
  Integer_BaseConvertToDigitArray,
  NonInteger_BaseConvertToDigitArray,
  inequality_core,
  notations
}