import { AutobuyerKind } from "./autobuyer";
import { fixSave } from "./saveload";

export const game_devTools={
  fixSave,
  print(){
    console.log(Object.keys(AutobuyerKind))
    console.log(AutobuyerKind)
  }
}