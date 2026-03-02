import { gameCache } from "./cache";
import Decimal from 'break_eternity.js';
import { player } from "./player";
import { getEnergyEffect } from "./fusion";
//TODO: cache these
export function getTranslatedDeflationPowerExponent(): Decimal{
  return new Decimal(0.5).add(gameCache.upgradeEffectValue.overflow[0].cachedValue)
}
export function getTranslatedDeflationPowerMultiplier(): Decimal{
  return gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.cachedValue.mul(getEnergyEffect());
}
export function getTranslatedDeflationPower(): Decimal{
  return player.deflationPower.pow(getTranslatedDeflationPowerExponent())
  .mul(getTranslatedDeflationPowerMultiplier())
}
//export const translatedDeflationPowerEffect = new Effect(gameCache.translatedDeflationPower, true);