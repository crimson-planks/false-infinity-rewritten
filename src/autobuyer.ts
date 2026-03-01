/** @prettier */
import Decimal from 'break_eternity.js';
import { CostScaling, ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import {
  addCurrency,
  type CurrencyKind,
  CurrencyKindObj,
  getCurrency,
  setCurrency
} from './currency';
import { autobuyerConstObj } from './autobuyer_const';
import { gameCache } from './cache';
import { getMatterAutobuyerCostScalingReductionByDeflation } from './prestige';

export function getAutobuyerCostScaling({kind, ord}: AutobuyerLocation): CostScaling {
  const ics = autobuyerConstObj[kind][ord].initialCostScaling;
  if (kind === AutobuyerKindObj.Matter)
    return new LinearCostScaling({
      baseCost: ics.baseCost.sub(gameCache.translatedDeflationPower.cachedValue),
      baseIncrease: ics.baseIncrease.sub(getMatterAutobuyerCostScalingReductionByDeflation())
    });
  if (kind === AutobuyerKindObj.DeflationPower) return ics;
  if (kind === AutobuyerKindObj.MatterAutobuyer) return ics;
  else {
    let leftover: never = kind;
    throw new TypeError(`invalid AutobuyerKind: ${kind}`);
  }
}

export function getIntervalCostScaling({kind, ord}: AutobuyerLocation) {
  const iics = autobuyerConstObj[kind][ord].initialIntervalCostScaling;
  if (kind === AutobuyerKindObj.Matter) {
    const finalIntervalCostScaling = new ExponentialCostScaling({
      baseCost: iics.baseCost,
      baseIncrease: iics.baseIncrease
    });
    if (player.upgrades.overflow[3].amount.gt(0))
      finalIntervalCostScaling.baseCost = finalIntervalCostScaling.baseCost.div(
        gameCache.upgradeEffectValue.overflow[3].cachedValue
      );
    return finalIntervalCostScaling;
  }
  if (kind === AutobuyerKindObj.DeflationPower || kind === AutobuyerKindObj.MatterAutobuyer)
    return iics;
  else {
    let leftover: never = kind;
    throw new TypeError(`Invalid AutobuyerKind: ${kind}`);
  }
}

//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export const AutobuyerKindObj = {
  Matter: 'matter',
  DeflationPower: 'deflationPower',
  MatterAutobuyer: 'matterAutobuyer'
} as const;
Object.freeze(AutobuyerKindObj);
export type AutobuyerKind = (typeof AutobuyerKindObj)[keyof typeof AutobuyerKindObj];
export const AutobuyerKindArr = [
  'matter',
  'deflationPower',
  'matterAutobuyer'
] as const satisfies AutobuyerKind[];
Object.freeze(AutobuyerKindArr);
export interface AutobuyerSaveData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  intervalAmount: Decimal;
  toggle: boolean;
  option?: {
    [propName: string]: unknown;
  };
}
export interface AutobuyerLocation {
  kind: AutobuyerKind;
  ord: number;
}
export function ToggleAutobuyer(loc: AutobuyerLocation) {
  const {kind, ord} = loc;
  player.autobuyers[kind][ord].toggle = !player.autobuyers[kind][ord].toggle;
}
export function BuyAutobuyer(loc: AutobuyerLocation, buyAmount: Decimal) {
  const {kind, ord} = loc;
  const currency = autobuyerConstObj[kind][ord].currency;
  const cost = getAutobuyerCostScaling(loc).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(buyAmount);
}
export function BuyInterval(loc: AutobuyerLocation, buyAmount: Decimal) {
  const {kind, ord} = loc;
  const currency = autobuyerConstObj[kind][ord].intervalCurrency;
  const cost = getIntervalCostScaling({kind, ord}).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].intervalAmount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].intervalAmount =
    player.autobuyers[kind][ord].intervalAmount.add(buyAmount);
}
export function BuyMaxInterval(loc: AutobuyerLocation) {
  const {kind, ord} = loc;
  BuyInterval(
    loc,
    getIntervalCostScaling(loc)
      .getAvailablePurchases(
        player.autobuyers[kind][ord].intervalAmount,
        getCurrency(autobuyerConstObj[kind][ord].currency)
      )
      .max(0)
      .floor()
  );
}
export function ClickMaxMatterAutobuyerInterval() {
  for (let i = 0; i < autobuyerConstObj.matter.length; i++) {
    BuyMaxInterval({kind: AutobuyerKindObj.Matter, ord: i});
  }
}
export function getIntervalMultiplierByBying({kind, ord}: AutobuyerLocation) {
  if (kind === AutobuyerKindObj.Matter || kind === AutobuyerKindObj.DeflationPower)
    return new Decimal(2).add(gameCache.upgradeEffectValue.overflow[2].cachedValue).recip();
  return new Decimal(0.5);
}
export function getAutobuyerInterval(loc: AutobuyerLocation) {
  const {kind, ord} = loc;
  let interval = autobuyerConstObj[kind][ord].initialInterval.mul(
    getIntervalMultiplierByBying(loc).pow(player.autobuyers[kind][ord].intervalAmount)
  );
  if (kind === AutobuyerKindObj.DeflationPower) {
    interval = interval.div(
      player.deflation
        .add(1)
        .mul(Decimal.dOne.add(gameCache.upgradeEffectValue.overflow[4].cachedValue))
    );
  }
  return interval;
}
export function AutobuyerTick(loc: AutobuyerLocation, timeS: Decimal) {
  const {kind, ord} = loc;
  const interval = getAutobuyerInterval(loc);
  const totalTime = timeS.add(player.autobuyers[kind][ord].timer ?? Decimal.dZero);
  player.autobuyers[kind][ord].timer = totalTime.mod(interval, true);
  const activationAmount = totalTime.div(interval).floor();
  if (!player.autobuyers[kind][ord].toggle) return;
  if (activationAmount.eq(Decimal.dZero)) return;
  if (kind === AutobuyerKindObj.Matter) {
    if (ord === 0) {
      addCurrency(
        CurrencyKindObj.matter,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    } else {
      if (player.autobuyers[kind][ord].amount.eq(0)) return;
      BuyAutobuyer(
        {kind: kind,
        ord: ord - 1},
        activationAmount.mul(player.autobuyers[kind][ord].amount).min(
          getAutobuyerCostScaling({kind: kind, ord: ord - 1})
            .getAvailablePurchases(player.autobuyers[kind][ord - 1].amount, player.matter)
            .max(0)
            .floor()
        )
      );
    }
  } else if (kind === AutobuyerKindObj.DeflationPower) {
    if (ord === 0) {
      addCurrency(
        CurrencyKindObj.deflationPower,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    }
  } else if (kind === AutobuyerKindObj.MatterAutobuyer) {
    const selectedOrd = Number(player.autobuyers.matterAutobuyer[0].option?.selectedOrd);
    if (ord === 0)
      BuyAutobuyer(
        {kind: AutobuyerKindObj.Matter,
        ord: selectedOrd},
        activationAmount
          .mul(player.autobuyers[kind][ord].amount)
          .min(
            getAutobuyerCostScaling({kind: AutobuyerKindObj.Matter, ord: selectedOrd})
              .getAvailablePurchases(
                player.autobuyers[AutobuyerKindObj.Matter][selectedOrd].amount,
                player.matter
              )
              .max(0)
              .floor()
          )
      );
  }
}
