import { gameCache } from "./cache";
import { Effect } from "./effect";
import Decimal from "./lib/break_eternity";
import { player } from "./player";
export function getTranslatedDeflationPower(){
  return player.deflationPower.sqrt()
}
//export const translatedDeflationPowerEffect = new Effect(gameCache.translatedDeflationPower, true);