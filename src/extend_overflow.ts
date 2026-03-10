import Decimal from "break_eternity.js";
import { ExponentialCostScaling } from "./cost";
import { getCurrency, setCurrency } from "./currency";
import { player } from "./player";

const extendOverflowCostScaling = {
  matter: new ExponentialCostScaling({
    baseCost: 1e9,
    baseIncrease: 10
  }),
  deflationPower: new ExponentialCostScaling({
    baseCost: 1e6,
    baseIncrease: 2
  }),
  overflowPoint: new ExponentialCostScaling({
    baseCost: 10,
    baseIncrease: 2
  })
}

export type extendOverflowCurrency = keyof typeof extendOverflowCostScaling;

export function IsExtendOverflowUnlocked(){
  return player.autobuyers.matterAutobuyer[0].amount.gt(0)
}

export function buyExtendOverflow(currency: extendOverflowCurrency){
  const cs = extendOverflowCostScaling[currency]
  const cost = cs.getCurrentCost(player.extendOverflow[currency]);
  if(cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.extendOverflow[currency] = player.extendOverflow[currency].add(1);
}
export function getExtendOverflowCost(currency: extendOverflowCurrency){
  return extendOverflowCostScaling[currency].getCurrentCost(player.extendOverflow[currency]);
}
export function getTotalOverflowExtension(){
  return player.extendOverflow.matter.add(player.extendOverflow.deflationPower).add(player.extendOverflow.overflowPoint);
}
export function getOverflowPointMultiplierByExtension(){
  return player.extendOverflow.currentLevel.add(1).mul(new Decimal(2).pow(player.extendOverflow.currentLevel.div(32)));
}