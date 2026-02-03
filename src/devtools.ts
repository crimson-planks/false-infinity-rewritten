import { AutobuyerKind } from "./autobuyer";
import { inequality_core } from "./notation";
import { fixSave } from "./saveload";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  },
  inequality_core
}