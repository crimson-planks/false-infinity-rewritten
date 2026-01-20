import { ExponentialCostScaling } from "./cost";
import Decimal from "./lib/break_eternity";
import { getDefaultPlayer, player } from "./player";
export const OVERFLOW = new Decimal(2).pow(31).minus(1)
export function resetAutobuyers(){
  player.autobuyers.matter = getDefaultPlayer().autobuyers.matter;
}
export const deflationCost = new ExponentialCostScaling({
  baseCost:new Decimal(1000),
  baseIncrease:new Decimal(10)
})
export function canDeflate(){
  return player.matter.gte(deflationCost.getCurrentCost(player.deflation))
}
export function canOverflow(){
  return player.matter.gte(OVERFLOW);
}
export function deflate(){
  if(!canDeflate()) return;
  player.deflation = player.deflation.add(1);
  player.deflator = player.deflator.add(player.deflation);

  resetAutobuyers();
  player.matter = Decimal.dZero;
  player.deflationPower=Decimal.dZero;
}
export function getSacrificeDeflationPowerToDeflationPowerBoost(deflationPower: Decimal){
  return deflationPower.sqr().add(1).log10().mul(0.1).add(1)
}
export function getDeflationPowerBoostWhenSacrifice(){
  return getSacrificeDeflationPowerToDeflationPowerBoost(player.deflationPower)
}
export function getDeflationPowerBoostBySacrificedDeflationPower(){
  return getSacrificeDeflationPowerToDeflationPowerBoost(player.previousSacrificeDeflationPower)
}
export function deflationSacrifice(){
  if(player.deflationPower.lte(player.previousSacrificeDeflationPower)) return;
  player.previousSacrificeDeflationPower=player.deflationPower;
  player.deflationPower=new Decimal();
}
export function overflow(){
  if(!canOverflow()) return;
  console.log("overflow")
  player.overflow = player.overflow.add(1)

  resetAutobuyers();
  player.matter = Decimal.dZero;
  player.deflationPower=Decimal.dZero;
  player.deflation = Decimal.dZero;
  player.deflator = Decimal.dZero;
  player.previousSacrificeDeflationPower = Decimal.dZero;
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;

  player.isOverflowing = false;
  player.overflowPoint = player.overflowPoint.add(1);
}
//TODO: add m key for maxing all intervals of matter autobuyers