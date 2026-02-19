import { AutobuyerKind, getAutobuyerCostScaling, getIntervalCostScaling } from "./autobuyer";
import { BaseConvert, hyperscientifify, scientifify } from "eternal_notations";
import { floorSlog10, FormatMufano, inequality_core, IntegerBase_ConvertToDigitArray, NonIntegerBase_ConvertToDigitArray, notationArray, notations } from "./notation";
import { fixSave, load, mergeObj_nocopy, save, toStringifiableObject, toUsableObject } from "./saveload";
import { ExponentialCostScaling, LinearCostScaling } from "./cost";
import { getDefaultPlayer, setPlayer } from "./player";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  },
  toStringifiableObject,
  toUsableObject,
  save,
  load,
  getDefaultPlayer,
  setPlayer,
  mergeObj_nocopy,
  LinearCostScaling,
  ExponentialCostScaling,
  getAutobuyerCostScaling,
  getIntervalCostScaling,
  BaseConvert,
  scientifify,
  hyperscientifify,
  floorSlog10,
  FormatMufano,
  IntegerBase_ConvertToDigitArray,
  NonIntegerBase_ConvertToDigitArray,
  inequality_core,
  notations
}