/** @prettier */
import { ExponentialCostScaling, LinearCostScaling } from './cost';
import { CurrencyKind, getCurrency, setCurrency } from './currency';
import Decimal from './lib/break_eternity';
import { player } from './player';
export const initialUpgradeCostScaling = {
  overflow: [
    new ExponentialCostScaling({ baseCost: new Decimal(1), baseIncrease: new Decimal(10) }),
    new ExponentialCostScaling({ baseCost: new Decimal(1), baseIncrease: new Decimal(8) }),
    new ExponentialCostScaling({ baseCost: new Decimal(2), baseIncrease: new Decimal(2) }),
    new LinearCostScaling({ baseCost: new Decimal(10), baseIncrease: Decimal.dZero }),
    new ExponentialCostScaling({ baseCost: new Decimal(2), baseIncrease: new Decimal(2) }),
    new LinearCostScaling({ baseCost: new Decimal(2), baseIncrease: Decimal.dZero }),
    new LinearCostScaling({ baseCost: new Decimal(10), baseIncrease: Decimal.dZero }),
    new LinearCostScaling({ baseCost: new Decimal(30), baseIncrease: Decimal.dZero })
  ]
};
export function getUpgradeCostScaling(kind: UpgradeKind, ord: number) {
  return initialUpgradeCostScaling[kind][ord];
}
export const upgradeCurrency = {
  overflow: [CurrencyKind.OverflowPoint, CurrencyKind.OverflowPoint, CurrencyKind.OverflowPoint]
};
export const upgradeMaxBuy = {
  overflow: [
    new Decimal(3),
    new Decimal(3),
    new Decimal(8),
    Decimal.dOne,
    new Decimal(3),
    Decimal.dOne,
    Decimal.dOne,
    Decimal.dOne
  ]
};
export enum UpgradeKind {
  Overflow = 'overflow'
}
export interface UpgradeData {
  kind: UpgradeKind;
  ord: number;
  amount: Decimal;
}
export function BuyUpgrade(kind: UpgradeKind, ord: number, buyAmount: Decimal) {
  const currency = upgradeCurrency[kind][ord];
  const cost = getUpgradeCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.upgrades[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.upgrades[kind][ord].amount = player.upgrades[kind][ord].amount.add(buyAmount);
}
