/** @prettier */
import Decimal from '@/lib/break_eternity';
import type { LinearCostScaling } from './cost';
import { player } from './player';
import { CurrencyKind, getCurrency, setCurrency } from './currency';

//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export enum AutobuyerKind {
  Matter = 'matter'
}
export interface AutobuyerData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  interval: Decimal;
  costScaling: LinearCostScaling;
}
export function BuyAutobuyer(kind: AutobuyerKind, ord: number) {
  const currentCost = player.autobuyers[kind][ord].costScaling.getCurrentCost(
    player.autobuyers[kind][ord].amount
  );
  if (currentCost.gt(getCurrency(CurrencyKind.Matter))) return;
  setCurrency(CurrencyKind.Matter, getCurrency(CurrencyKind.Matter).sub(currentCost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(1);
}
export function AutobuyerTick(kind: AutobuyerKind, ord: number, timeS: Decimal) {
  const totalTime = timeS.add(player.autobuyers[kind][ord].timer ?? Decimal.dZero);
  player.autobuyers[kind][ord].timer = totalTime.mod(player.autobuyers[kind][ord].interval, true);
  player.matter = player.matter.add(
    totalTime
      .div(player.autobuyers[kind][ord].interval)
      .floor()
      .mul(player.autobuyers[kind][ord].amount)
  );
}
