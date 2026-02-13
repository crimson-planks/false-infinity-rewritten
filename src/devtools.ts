import { AutobuyerKind } from "./autobuyer";
import { BaseConvert } from "eternal_notations";
import { inequality_core, IntegerBaseConvertToDigitArray, NonInteger_BaseConverToDigit, notationArray, notations } from "./notation";
import { fixSave } from "./saveload";
import { input } from "./ui";

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
  input,
  notations
}