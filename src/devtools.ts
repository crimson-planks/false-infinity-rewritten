import { AutobuyerKind } from "./autobuyer";
import { BaseConvert } from "eternal_notations";
import { FormatInequality, inequality_core, IntegerBaseConvertToDigitArray, NonInteger_BaseConverToDigit } from "./notation";
import { fixSave } from "./saveload";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  },
  BaseConvert,
  IntegerBaseConvertToDigitArray,
  NonInteger_BaseConverToDigit,
  inequality_core,
  FormatInequality
}