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
function getDeflationPowerToDeflationAutobuyerBoost(deflationPower: Decimal){
  return deflationPower.cbrt().ceil();
}
export function getDeflationAutobuyerBoostWhenSacrifice(){
  return getDeflationPowerToDeflationAutobuyerBoost(player.deflationPower).sub(
      getDeflationPowerToDeflationAutobuyerBoost(player.previousSacrificeDeflationPower)).ceil().max(0);
}
export function deflationSacrifice(){
  if(player.deflationPower.lte(player.previousSacrificeDeflationPower)) return;
  player.deflator = player.deflator.add(getDeflationAutobuyerBoostWhenSacrifice());
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
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;

  player.isOverflowing = false;
  player.overflowPoint = player.overflowPoint.add(1);
}