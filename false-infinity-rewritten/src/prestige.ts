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

  resetAutobuyers();
  player.matter = Decimal.dZero;
}