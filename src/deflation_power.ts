import { gameCache } from "./cache";
import Decimal from 'break_eternity.js';
import { player } from "./player";
import { getEnergyEffect } from "./fusion";
import { d0_5 } from "./constants";
export function convert_SacrificedDeflationPower_To_DeflationPowerBoost(deflationPower: Decimal){
  return deflationPower.clampMin(0).add(1).log10().div(3).clampMin(1).pow(getEnergyEffect(player.fusion.energy))
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
  return d0_5.add(gameCache.upgradeEffectValue.overflow[0].cachedValue)
}
export function getTranslatedDeflationPowerMultiplier(): Decimal{
  if(player.currentOverflowChallenge==='oc1') return new Decimal(Decimal.dZero);
  return gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.cachedValue;
}
export function getTranslatedDeflationPower(): Decimal{
  return player.deflationPower.pow(getTranslatedDeflationPowerExponent())
  .mul(getTranslatedDeflationPowerMultiplier())
}
//export const translatedDeflationPowerEffect = new Effect(gameCache.translatedDeflationPower, true);