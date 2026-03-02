/** @prettier */
import { ConstantCostScaling, CostScaling, ExponentialCostScaling, LinearCostScaling } from './cost';
import { CurrencyKindObj, getCurrency, setCurrency, type CurrencyKind } from './currency';
import { getTranslatedDeflationPower } from './deflation_power';
import Decimal from 'break_eternity.js';
import { player } from './player';

export function getUpgradeCostScaling(kind: UpgradeKind, ord: number) {
  return upgradeConstObj[kind][ord].initialCostScaling;
}

/*
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
} as const;
*/
export const UpgradeKindObj = {
  Overflow: 'overflow'
} as const;
Object.freeze(UpgradeKindObj)
export type UpgradeKind = (typeof UpgradeKindObj)[keyof typeof UpgradeKindObj];
export const UpgradeKindArr = ['overflow'] as const satisfies UpgradeKind[];
Object.freeze(UpgradeKindArr)
export interface UpgradeSaveData {
  kind: UpgradeKind;
  ord: number;
  amount: Decimal;
}
export interface UpgradeLocation {
  kind: UpgradeKind;
  ord: number;
}

export interface UpgradeConstData {
  kind: UpgradeKind;
  ord: number;
  initialCostScaling: CostScaling;
  currency: CurrencyKind;
  maxAmount: Decimal;
  effectValueFunction: () => Decimal;
}
export const upgradeConstObj = {
  overflow: [
    {
      kind: UpgradeKindObj.Overflow,
      ord: 0,
      initialCostScaling: new ExponentialCostScaling({
        baseCost: new Decimal(1),
        baseIncrease: new Decimal(10)
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(4),
      effectValueFunction: () => {
        return player.upgrades.overflow[0].amount.mul(0.125);
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 1,
      initialCostScaling: new ExponentialCostScaling({
        baseCost: new Decimal(1),
        baseIncrease: new Decimal(8)
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(3),
      effectValueFunction: () => {
        return player.upgrades.overflow[1].amount.pow_base(3);
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 2,
      initialCostScaling: new ExponentialCostScaling({
        baseCost: new Decimal(1),
        baseIncrease: new Decimal(2)
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(8),
      effectValueFunction: () => {
        return player.upgrades.overflow[2].amount.mul(0.125);
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 3,
      initialCostScaling: new LinearCostScaling({
        baseCost: new Decimal(3),
        baseIncrease: Decimal.dZero
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(Decimal.dOne),
      effectValueFunction: () => {
        return getTranslatedDeflationPower().max(1).sqrt();
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 4,
      initialCostScaling: new ExponentialCostScaling({
        baseCost: new Decimal(1),
        baseIncrease: new Decimal(2)
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(3),
      effectValueFunction: () => {
        return player.upgrades.overflow[4].amount;
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 5,
      initialCostScaling: new LinearCostScaling({
        baseCost: new Decimal(2),
        baseIncrease: Decimal.dZero
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: Decimal.dOne,
      effectValueFunction: () => {
        if (player.fastestOverflowTime == undefined) return Decimal.dZero;
        return new Decimal(1000).div(new Decimal(player.fastestOverflowTime / 2000).max(1));
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 6,
      initialCostScaling: new LinearCostScaling({
        baseCost: new Decimal(2),
        baseIncrease: Decimal.dZero
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: Decimal.dOne,
      effectValueFunction: () => {
        return player.deflation.add(1);
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 7,
      initialCostScaling: new ExponentialCostScaling({
        baseCost: new Decimal(2),
        baseIncrease: new Decimal(2)
      }),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(8),
      effectValueFunction: () => {
        if (player.upgrades.overflow[7].amount.eq(0)) return Decimal.dZero;
        return player.upgrades.overflow[7].amount.pow10();
      }
    },
    {
      kind: UpgradeKindObj.Overflow,
      ord: 8,
      initialCostScaling: new ConstantCostScaling(1000),
      currency: CurrencyKindObj.overflowPoint,
      maxAmount: new Decimal(Decimal.dOne),
      effectValueFunction: () => {
        return player.upgrades.overflow?.[8]?.amount
      }
    }
  ]
} as const satisfies {
  overflow: UpgradeConstData[];
};
Object.freeze(upgradeConstObj)

export const upgradeCurrency: { overflow: 'overflowPoint'[] } = {
  overflow: Array(upgradeConstObj.overflow.length).fill(CurrencyKindObj.overflowPoint)
} as const;
Object.freeze(upgradeCurrency)

/*
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
      if (player.fastestOverflowTime == undefined) return Decimal.dZero;
      return new Decimal(1000).div(new Decimal(player.fastestOverflowTime / 2000).max(1));
    },
    function () {
      return player.deflation.add(1);
    },
    function () {
      if (player.upgrades.overflow[7].amount.eq(0)) return Decimal.dZero;
      return player.upgrades.overflow[7].amount.pow10();
    }
  ]
} as const;
 */

export function BuyUpgrade(kind: UpgradeKind, ord: number, buyAmount: Decimal) {
  if (player.upgrades[kind][ord].amount.add(buyAmount).gt(upgradeConstObj[kind][ord].maxAmount)) return;
  const currency = upgradeCurrency[kind][ord];
  const cost = getUpgradeCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.upgrades[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.upgrades[kind][ord].amount = player.upgrades[kind][ord].amount.add(buyAmount);
}
