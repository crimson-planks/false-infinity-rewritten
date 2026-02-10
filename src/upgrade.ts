/** @prettier */
import { ExponentialCostScaling, LinearCostScaling } from './cost';
import { CurrencyKind, getCurrency, setCurrency } from './currency';
import { getTranslatedDeflationPower } from './deflation_power';
import Decimal from 'break_eternity.js';
import { player } from './player';
export const OVERFLOW_UPGRADE_COUNT = 8;
export const initialUpgradeCostScaling = {
  overflow: [
    new ExponentialCostScaling({ baseCost: new Decimal(1), baseIncrease: new Decimal(10) }),
    new ExponentialCostScaling({ baseCost: new Decimal(1), baseIncrease: new Decimal(8) }),
    new ExponentialCostScaling({ baseCost: new Decimal(2), baseIncrease: new Decimal(2) }),
    new LinearCostScaling({ baseCost: new Decimal(10), baseIncrease: Decimal.dZero }),
    new ExponentialCostScaling({ baseCost: new Decimal(2), baseIncrease: new Decimal(2) }),
    new LinearCostScaling({ baseCost: new Decimal(2), baseIncrease: Decimal.dZero }),
    new LinearCostScaling({ baseCost: new Decimal(10), baseIncrease: Decimal.dZero }),
    new ExponentialCostScaling({ baseCost: new Decimal(2), baseIncrease: new Decimal(2) })
  ]
};
export function getUpgradeCostScaling(kind: UpgradeKind, ord: number) {
  return initialUpgradeCostScaling[kind][ord];
}
export const upgradeCurrency = {
  overflow: Array(OVERFLOW_UPGRADE_COUNT)
    .fill(0)
    .map((v, i) => CurrencyKind.OverflowPoint)
};
export const upgradeMaxAmount = {
  overflow: [
    new Decimal(4),
    new Decimal(3),
    new Decimal(8),
    Decimal.dOne,
    new Decimal(3),
    Decimal.dOne,
    Decimal.dOne,
    new Decimal(8)
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
export const upgradeEffectValueFuncArray = {
  overflow: [
    function () {
      return player.upgrades.overflow[0].amount.mul(0.125);
    },
    function () {
      return player.upgrades.overflow[1].amount.pow_base(2);
    },
    function () {
      return player.upgrades.overflow[2].amount.mul(0.125);
    },
    function () {
      return getTranslatedDeflationPower().max(1).sqrt();
    },
    function () {
      return player.upgrades.overflow[4].amount;
    },
    function () {
      if (player.fastestOverflowTime === undefined) return Decimal.dZero;
      return new Decimal(1000).div(new Decimal(player.fastestOverflowTime / 1000).div(2).max(1));
    },
    function () {
      return player.deflation.add(1);
    },
    function () {
      if (player.upgrades.overflow[7].amount.eq(0)) return Decimal.dZero;
      return player.upgrades.overflow[7].amount.pow10();
    }
  ]
};
export function BuyUpgrade(kind: UpgradeKind, ord: number, buyAmount: Decimal) {
  if (player.upgrades[kind][ord].amount.add(buyAmount).gt(upgradeMaxAmount[kind][ord])) return;
  const currency = upgradeCurrency[kind][ord];
  const cost = getUpgradeCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.upgrades[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.upgrades[kind][ord].amount = player.upgrades[kind][ord].amount.add(buyAmount);
}
