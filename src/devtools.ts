import { AutobuyerKind, getAutobuyerCostScaling, getIntervalCostScaling } from "./autobuyer";
import { BaseConvert } from "eternal_notations";
import { FormatMufano, inequality_core, IntegerBase_ConvertToDigitArray, NonIntegerBase_ConvertToDigitArray, notationArray, notations } from "./notation";
import { fixSave } from "./saveload";
import { ExponentialCostScaling, LinearCostScaling } from "./cost";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  },
  LinearCostScaling,
  ExponentialCostScaling,
  getAutobuyerCostScaling,
  getIntervalCostScaling,
  BaseConvert,
  FormatMufano,
  IntegerBase_ConvertToDigitArray,
  NonIntegerBase_ConvertToDigitArray,
  inequality_core,
  notations
}