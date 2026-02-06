import { AutobuyerKind } from "./autobuyer";
import { BaseConvert } from "./lib/eternal_notations.esm";
import { FormatInequality, inequality_core, IntegerBaseConvertToDigitArray, multslog } from "./notation";
import { fixSave } from "./saveload";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  },
  BaseConvert,
  IntegerBaseConvertToDigitArray,
  inequality_core,
  FormatInequality,
  multslog
}