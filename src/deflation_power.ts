import { gameCache } from "./cache";
import { Effect } from "./effect";
import Decimal from "./lib/break_eternity";
import { player } from "./player";
export function getTranslatedDeflationPower(): Decimal{
  return player.deflationPower.pow(0.5).mul(gameCache.deflationPowerBoostBySacrificedDeflationPower.cachedValue)
}
//export const translatedDeflationPowerEffect = new Effect(gameCache.translatedDeflationPower, true);