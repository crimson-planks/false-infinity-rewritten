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
    baseIncrease: 4
  }),
  overflowPoint: new ExponentialCostScaling({
    baseCost: 1000,
    baseIncrease: 2
  }),
  helium: new ExponentialCostScaling({
    baseCost: 1e3,
    baseIncrease: 4
  })
}

export type extendOverflowCurrency = keyof typeof extendOverflowCostScaling;

export function IsExtendOverflowUnlocked(){
  return player.overflowAutobuyer.bought>=5
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
  return player.extendOverflow.matter.add(player.extendOverflow.deflationPower).add(player.extendOverflow.overflowPoint).add(player.extendOverflow.helium);
}
export function getOverflowPointMultiplierByExtension(){
  return player.extendOverflow.currentLevel.add(1).mul(player.extendOverflow.currentLevel.div(32).pow10());
}