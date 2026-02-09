import { gameCache } from "./cache";
import { ExponentialCostScaling } from "./cost";
import Decimal from 'break_eternity.js';
import { getDefaultPlayer, player } from "./player";
export const OVERFLOW = new Decimal(2).pow(31).minus(1)
export function resetAutobuyers(){
  player.autobuyers.matter = getDefaultPlayer().autobuyers.matter;
}
export function getStartMatter(){
  return new Decimal(0).add(gameCache.upgradeEffectValue.overflow[7].cachedValue)
}
export const deflationCost = new ExponentialCostScaling({
  baseCost:new Decimal(1000),
  baseIncrease:new Decimal(10)
})
//TODO: add caching to the 'get' functions
export function getDeflationCost(){
  return new ExponentialCostScaling({
    baseCost: deflationCost.baseCost,
    baseIncrease: deflationCost.baseIncrease
  })
}
export function canDeflate(){
  return player.matter.gte(getDeflationCost().getCurrentCost(player.deflation))
}
export function canOverflow(){
  return player.matter.gte(OVERFLOW) || player.isOverflowing;
}
export function getDeflatorGainOnDeflation(): Decimal{
  return player.deflation.add(1).mul(gameCache.upgradeEffectValue.overflow[1].cachedValue);
}
export function deflate(){
  if(!canDeflate()) return;
  player.lastDeflationTime = Date.now();
  player.deflation = player.deflation.add(1);
  player.deflator = player.deflator.add(getDeflatorGainOnDeflation());

  resetAutobuyers();
  player.matter = getStartMatter();
  player.deflationPower=Decimal.dZero;
}
export function getSacrificeDeflationPowerToDeflationPowerBoost(deflationPower: Decimal){
  return deflationPower.sqr().add(1).log10().div(6).max(1)
}
export function getDeflationPowerBoostWhenSacrifice(){
  return getSacrificeDeflationPowerToDeflationPowerBoost(player.deflationPower)
}
export function getDeflationPowerBoostBySacrificedDeflationPower(){
  return getSacrificeDeflationPowerToDeflationPowerBoost(player.previousSacrificeDeflationPower)
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
export function getOverflowPointGain(){
  let finalGain = new Decimal(1)
  if(player.upgrades.overflow[5].amount.gt(0)) finalGain = finalGain.add(gameCache.upgradeEffectValue.overflow[5].cachedValue.floor()).mul(gameCache.upgradeEffectValue.overflow[6].cachedValue)
  return finalGain
}
export function overflow(){
  if(!canOverflow()) return;
  console.log("overflow")
  let overflowDTime = player.currentTime-player.lastOverflowTime;
  player.lastOverflowTime = player.currentTime;
  if(player.fastestOverflowTime === undefined || overflowDTime<player.fastestOverflowTime){
    player.fastestOverflowTime = overflowDTime;
  }

  player.overflow = player.overflow.add(1);
  player.isOverflowing = false;
  player.overflowPoint = player.overflowPoint.add(getOverflowPointGain());

  resetAutobuyers();
  player.matter = getStartMatter();
  player.deflationPower=Decimal.dZero;
  player.deflation = Decimal.dZero;
  player.deflator = Decimal.dZero;
  player.previousSacrificeDeflationPower = Decimal.dZero;
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;

}