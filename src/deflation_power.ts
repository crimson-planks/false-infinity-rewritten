import { gameCache } from "./cache";
import Decimal from 'break_eternity.js';
import { player } from "./player";
import { getEnergyEffect } from "./fusion";
export function convert_SacrificedDeflationPower_To_DeflationPowerBoost(deflationPower: Decimal){
  return deflationPower.sqr().add(1).log10().div(6).max(1).pow(getEnergyEffect(player.fusion.energy))
}
export function getDeflationPowerBoostWhenSacrifice(){
  return convert_SacrificedDeflationPower_To_DeflationPowerBoost(player.deflationPower)
}
export function getDeflationPowerBoostBySacrificedDeflationPower(){
  return convert_SacrificedDeflationPower_To_DeflationPowerBoost(player.previousSacrificeDeflationPower)
}
export function canDeflationSacrifice(): boolean{
  return gameCache.translatedDeflationPowerMultiplierWhenSacrifice.cachedValue.gt(gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.cachedValue) &&
   player.deflationPower.gt(player.previousSacrificeDeflationPower)
}
export function deflationSacrifice(){
  if(!canDeflationSacrifice()) return;
  player.previousSacrificeDeflationPower=player.deflationPower;
  player.deflationPower=new Decimal();
}
//TODO: cache these
export function getTranslatedDeflationPowerExponent(): Decimal{
  return new Decimal(0.5).add(gameCache.upgradeEffectValue.overflow[0].cachedValue)
}
export function getTranslatedDeflationPowerMultiplier(): Decimal{
  return gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.cachedValue;
}
export function getTranslatedDeflationPower(): Decimal{
  return player.deflationPower.pow(getTranslatedDeflationPowerExponent())
  .mul(getTranslatedDeflationPowerMultiplier())
}
//export const translatedDeflationPowerEffect = new Effect(gameCache.translatedDeflationPower, true);