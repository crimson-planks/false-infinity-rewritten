import Decimal from "./lib/break_eternity";
import { player } from "./player";
export function getTranslatedDeflationPower(){
  return player.deflationPower.sqrt()
}
