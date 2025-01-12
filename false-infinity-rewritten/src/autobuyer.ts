/** @prettier */
import Decimal from '@/lib/break_eternity';
import { ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import { CurrencyKind, getCurrency, setCurrency } from './currency';
export const initialAutobuyerCostScaling = {
  matter: [
    new LinearCostScaling({
      baseCost: new Decimal(10),
      baseIncrease: new Decimal(5)
    }),
    new LinearCostScaling({
      baseCost: new Decimal(500),
      baseIncrease: new Decimal(100)
    })
  ]
};
export function getAutobuyerCostScaling(kind: AutobuyerKind, ord: number){
  return initialAutobuyerCostScaling.matter[ord];
}
export const initialIntervalCostScaling = {
  matter: [
    new ExponentialCostScaling({
      baseCost: new Decimal(100),
      baseIncrease: new Decimal(10)
    }),
    new ExponentialCostScaling({
      baseCost: new Decimal(1000),
      baseIncrease: new Decimal(100)
    })
  ]
};
export function getIntervalCostScaling(kind: AutobuyerKind, ord: number){
  return initialIntervalCostScaling.matter[ord];
}
export const autobuyerCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter]
};
export const intervalCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter]
};
export const initialInterval = {
  matter: [new Decimal(1), new Decimal(2)]
};
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
  intervalAmount: Decimal;
}
export function BuyAutobuyer(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = autobuyerCurrency[kind][ord];
  const cost = getAutobuyerCostScaling(kind,ord).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(buyAmount);
}
export function BuyInterval(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = autobuyerCurrency[kind][ord];
  const cost = getIntervalCostScaling(kind,ord).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].intervalAmount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].intervalAmount =
    player.autobuyers[kind][ord].intervalAmount.add(buyAmount);
}
export function AutobuyerTick(kind: AutobuyerKind, ord: number, timeS: Decimal) {
  player.autobuyers[kind][ord].interval = initialInterval[kind][ord].mul(
    new Decimal(0.5).pow(player.autobuyers[kind][ord].intervalAmount)
  );
  const totalTime = timeS.add(player.autobuyers[kind][ord].timer ?? Decimal.dZero);
  player.autobuyers[kind][ord].timer = totalTime.mod(player.autobuyers[kind][ord].interval, true);
  const activationAmount = totalTime.div(player.autobuyers[kind][ord].interval).floor();
  if (activationAmount.eq(0)) return;
  if (kind === AutobuyerKind.Matter) {
    if (ord === 0) {
      player.matter = player.matter.add(activationAmount.mul(player.autobuyers[kind][ord].amount));
    } else {
      if (player.autobuyers[kind][ord].amount.eq(0)) return;
      BuyAutobuyer(
        kind,
        ord - 1,
        activationAmount.mul(player.autobuyers[kind][ord].amount).min(
          getAutobuyerCostScaling(kind,ord - 1)
            .getAvailablePurchases(player.autobuyers[kind][ord - 1].amount, player.matter)
            .max(0)
            .floor()
        )
      );
    }
  }
}
