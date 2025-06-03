import { ExponentialCostScaling } from "./cost";
import Decimal from "./lib/break_eternity";
import { getDefaultPlayer, player } from "./player";

export function resetAutobuyers(){
  player.autobuyers.matter = getDefaultPlayer().autobuyers.matter;
}
export const deflationCost = new ExponentialCostScaling({baseCost:new Decimal(1000),baseIncrease:new Decimal(10)})
export function deflate(){
  if(player.matter.lt(deflationCost.getCurrentCost(player.deflation))) return;
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
      getDeflationPowerToDeflationAutobuyerBoost(player.previousSacrificeDeflationPower)).ceil();
}
export function deflationSacrifice(){
  if(player.deflationPower.lte(player.previousSacrificeDeflationPower)) return;
  player.deflationBoost = player.deflationBoost.add(getDeflationAutobuyerBoostWhenSacrifice());
  player.previousSacrificeDeflationPower=player.deflationPower;
  player.deflationPower=new Decimal();
}