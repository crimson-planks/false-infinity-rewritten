import { gameCache } from "./cache";
import { ExponentialCostScaling, LinearCostScaling } from "./cost";
import Decimal from 'break_eternity.js';
import { getDefaultPlayer, player } from "./player";
import { addCurrency, CurrencyKindObj, getCurrency, setCurrency } from "./currency";
import { getOverflowPointMultiplierByExtension } from "./extend_overflow";
import { getEnergyGainWhenFusing } from "./fusion";
import { challengeConstObj, resetChallengeStuff, type OverflowChallenge } from "./challenge";
import { getDefaultAutobuyerSaveData } from "./autobuyer";
import { D_AVOGADRO_NUMBER } from "./constants";

export const OVERFLOW = new Decimal(2_147_483_647) //new Decimal(2).pow(31).sub(1)
export function getOverflowLimit(){
  if(player.currentOverflowChallenge!=undefined){
    return challengeConstObj[player.currentOverflowChallenge].goal;
  }
  return new Decimal(2).pow(player.extendOverflow.currentLevel.add(31)).sub(1);
}
export function resetMatterAutobuyers(){
  player.autobuyers.matter = getDefaultPlayer().autobuyers.matter;
}
export function getStartMatter(){
  return new Decimal(0).add(gameCache.upgradeEffectValue.overflow[7].cachedValue)
}
export const deflationCostScaling = new ExponentialCostScaling({
  baseCost: new Decimal(1000),
  baseIncrease: new Decimal(10)
})
export const deflatorGainScaling = new LinearCostScaling({
  baseCost: 1,
  baseIncrease: 1
})
export const starCostScaling = new ExponentialCostScaling({
  baseCost: new Decimal(1e9),
  baseIncrease: 10
})
export function getDeflationCostScaling_core(){
  const rslt = new ExponentialCostScaling({
    baseCost: deflationCostScaling.baseCost,
    baseIncrease: deflationCostScaling.baseIncrease
  })
  if(player.upgrades.helium[1].amount.gt(0)) rslt.baseIncrease = rslt.baseIncrease.sub(player.upgrades.helium[1].amount);
  return rslt;
}
export function getDeflationCostScaling(){
  if(player.currentOverflowChallenge==='oc4') return getMoleCostScaling_core();
  return getDeflationCostScaling_core();
}
export function getDeflatorGainScaling(){
  return new LinearCostScaling({
    baseCost: deflatorGainScaling.baseCost.mul(Decimal.dOne.add(gameCache.upgradeEffectValue.overflow[1].cachedValue)),
    baseIncrease: deflatorGainScaling.baseIncrease.mul(Decimal.dOne.add(gameCache.upgradeEffectValue.overflow[1].cachedValue))
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
  return getDeflationCostScaling().getAvailablePurchases(player.deflation, player.matter).floor();
}
export function canDeflate(bulk = Decimal.dOne){
  return player.matter.gte(getDeflationCostScaling().getCurrentCost(player.deflation.add(bulk).sub(1)))
}
export function canOverflow(){
  return player.matter.gte(getOverflowLimit()) || player.isOverflowing;
}
export function getDeflatorGainOnDeflation(bulk = Decimal.dOne): Decimal{
  return getDeflatorGainScaling().getTotalCostAfterPurchase(player.deflation, bulk);
}
export function deflationReset(forced = false, bulk = Decimal.dOne){
  if(!forced && bulk.lt(1)) return;
  if(!canDeflate(bulk) || player.isOverflowing) return;
  //console.log("deflate")
  deflationGiveRewards(bulk);

  if(player.challenges.overflow.oc2.completed && player.currentOverflowChallenge !== 'oc3') {
    return;
  }

  deflationResetValues();
}
export function deflationUpdateStatistics(){
  player.lastDeflationTime = player.currentTime;
}
function deflationGiveRewards(bulk = Decimal.dOne){
  deflationUpdateStatistics();

  player.deflator = player.deflator.add(getDeflatorGainOnDeflation(bulk));
  player.deflation = player.deflation.add(bulk);
}
export function resetTier0(){
  resetMatterAutobuyers();

  if(player.currentOverflowChallenge){
    resetChallengeStuff();
  }

  player.matter = getStartMatter();
  player.deflationPower=Decimal.dZero;
}
export function deflationResetValues(){
  resetTier0();
}
export function hasDeflated(){
  return player.deflation.gt(0);
}
export const moleCostScaling= new ExponentialCostScaling({
  baseCost: D_AVOGADRO_NUMBER,
  baseIncrease: D_AVOGADRO_NUMBER,
})
export function isMoleUnlocked(){
  return player.challenges.overflow.oc3.completed;
}
export function getMoleCostScaling_core(){
  return moleCostScaling;
}
export function getMoleCostScaling(){
  if(player.currentOverflowChallenge==='oc4') return getDeflationCostScaling_core();
  return getMoleCostScaling_core();
}
export function getMoleCost(){
  return getMoleCostScaling().getCurrentCost(player.mole);
}
export function canMoleReset(){
  return getMoleCost().lte(player.matter);
}
export function moleReset(){
  if(!canMoleReset()) return;

  player.mole = player.mole.add(1);
  resetTier0();

}
export function getOverflowPointGain(){
  let finalGain = Decimal.dOne;
  if(player.upgrades.overflow[5].amount.gt(0)) finalGain = finalGain.add(gameCache.upgradeEffectValue.overflow[5].cachedValue.floor())
  if(player.upgrades.overflow[6].amount.gt(0)) finalGain = finalGain.mul(gameCache.upgradeEffectValue.overflow[6].cachedValue);
  if(player.extendOverflow.currentLevel.gt(0)){ finalGain = finalGain.mul(getOverflowPointMultiplierByExtension())}
  finalGain = finalGain.floor();
  return finalGain;
}
export function hasOverflowed(){
  return player.overflow.gt(0);
}
export function overflowReset(forced = false, enteringOverflowChallenge: OverflowChallenge | undefined = undefined){
  if(!forced && !canOverflow()) return;
  //console.log("overflow")
  if(canOverflow()) {
    overflowGiveRewards();
  }

  overflowResetValues();

}
export function overflowUpdateStatistics(){
  let overflowDTime = player.currentTime-player.lastOverflowTime;
  if(player.fastestOverflowTime === undefined || overflowDTime<player.fastestOverflowTime){
    player.fastestOverflowTime = overflowDTime;
  }
}
export function overflowGiveRewards(){
  overflowUpdateStatistics();

  if(player.currentOverflowChallenge!=undefined){
    player.challenges.overflow[player.currentOverflowChallenge].completed = true;
  }
  player.overflow = player.overflow.add(1);
  player.isOverflowing = false;
  player.overflowPoint = player.overflowPoint.add(getOverflowPointGain());
  if(player.fusion.isFusing){
    addCurrency(CurrencyKindObj.energy,getEnergyGainWhenFusing());
  }
}
export function overflowResetValues(){

  player.lastDeflationTime = player.currentTime;
  player.lastOverflowTime = player.currentTime;
  resetTier0();

  player.currentOverflowChallenge = undefined;

  player.deflation = Decimal.dZero;
  player.deflator = Decimal.dZero;
  player.mole = Decimal.dZero;
  player.previousSacrificeDeflationPower = Decimal.dZero;
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;
}