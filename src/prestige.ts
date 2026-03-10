import { gameCache } from "./cache";
import { ExponentialCostScaling, LinearCostScaling } from "./cost";
import Decimal from 'break_eternity.js';
import { getDefaultPlayer, player } from "./player";
import { getCurrency, setCurrency } from "./currency";
import { getOverflowPointMultiplierByExtension } from "./extend_overflow";

export const OVERFLOW = new Decimal(2_147_483_647) //new Decimal(2).pow(31).sub(1)
export function getOverflowLimit(){
  return new Decimal(2).pow(player.extendOverflow.currentLevel.add(31)).sub(1);
}
export function resetAutobuyers(){
  player.autobuyers.matter = getDefaultPlayer().autobuyers.matter;
}
export function getStartMatter(){
  return new Decimal(0).add(gameCache.upgradeEffectValue.overflow[7].cachedValue)
}
export const deflationCostScaling = new ExponentialCostScaling({
  baseCost:new Decimal(1000),
  baseIncrease:new Decimal(10)
})
export const deflatorGainScaling = new LinearCostScaling({
  baseCost: 1,
  baseIncrease: 1
})
export const starCostScaling = new ExponentialCostScaling({
  baseCost: new Decimal(1e9),
  baseIncrease: 10
})
export function getDeflatorGainScaling(){
  return new LinearCostScaling({
    baseCost: deflatorGainScaling.baseCost.mul(new Decimal(1).add(gameCache.upgradeEffectValue.overflow[1].cachedValue)),
    baseIncrease: deflatorGainScaling.baseIncrease.mul(new Decimal(1).add(gameCache.upgradeEffectValue.overflow[1].cachedValue))
  })
}
export function getStarCost(){
  return starCostScaling.getCurrentCost(player.fusion.star);
}
export function getMatterAutobuyerCostScalingReductionByDeflation(){
  return player.deflation.min(4);
}
export function BuyStar(){
  if(player.isOverflowing) return;
  if(!starCostScaling.canBuy(player.fusion.star, Decimal.dOne, getCurrency('matter'))) return;
  setCurrency('matter', getCurrency('matter').sub(getStarCost()));
  player.fusion.star = player.fusion.star.add(1);
}
export function getPossibleDeflateAmount(){
  return deflationCostScaling.getAvailablePurchases(player.deflation, player.matter).floor();
}
export function canDeflate(bulk = new Decimal(1)){
  return player.matter.gte(deflationCostScaling.getCurrentCost(player.deflation.add(bulk).sub(1)))
}
export function canOverflow(){
  return player.matter.gte(getOverflowLimit()) || player.isOverflowing;
}
export function getDeflatorGainOnDeflation(bulk = new Decimal(1)): Decimal{
  return getDeflatorGainScaling().getTotalCostAfterPurchase(player.deflation, bulk);
}
export function deflate(bulk = new Decimal(1)){
  if(bulk.lt(1)) return;
  if(!canDeflate(bulk) || player.isOverflowing) return;
  console.log("deflate")
  player.lastDeflationTime = Date.now();
  player.deflator = player.deflator.add(getDeflatorGainOnDeflation(bulk));
  player.deflation = player.deflation.add(bulk);

  if(player.upgrades.helium[0].amount.gt(0)) {
    return;
  }

  resetAutobuyers();
  player.matter = getStartMatter();
  player.deflationPower=Decimal.dZero;
}
export function hasDeflated(){
  return player.deflation.gt(0);
}

export function getOverflowPointGain(){
  let finalGain = new Decimal(1)
  if(player.upgrades.overflow[5].amount.gt(0)) finalGain = finalGain.add(gameCache.upgradeEffectValue.overflow[5].cachedValue.floor()).mul(gameCache.upgradeEffectValue.overflow[6].cachedValue);
  if(player.extendOverflow.currentLevel.gt(0)){ finalGain = finalGain.mul(getOverflowPointMultiplierByExtension())}
  return finalGain
}
export function hasOverflowed(){
  return player.overflow.gt(0);
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
  player.deflationPower = Decimal.dZero;
  player.deflation = Decimal.dZero;
  player.deflator = Decimal.dZero;
  player.previousSacrificeDeflationPower = Decimal.dZero;
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;

}