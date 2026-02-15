/** @prettier */
import Decimal from 'break_eternity.js';
import { ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import { addCurrency, CurrencyKind, getCurrency, setCurrency } from './currency';
import { gameCache } from './cache';
export const initialAutobuyerCostScaling = {
  matter: [
    new LinearCostScaling({
      baseCost: new Decimal(10),
      baseIncrease: new Decimal(5)
    }),
    new LinearCostScaling({
      baseCost: new Decimal(500),
      baseIncrease: new Decimal(100)
    }),
    new LinearCostScaling({
      baseCost: new Decimal(1e7),
      baseIncrease: new Decimal(1e6)
    })
  ],
  deflationPower: [
    new LinearCostScaling({
      baseCost: new Decimal(1),
      baseIncrease: new Decimal(0)
    })
  ],
  matterAutobuyer: [
    new LinearCostScaling({
      baseCost: new Decimal(10),
      baseIncrease: new Decimal(50)
    })
  ]
};
export function getAutobuyerCostScaling(kind: AutobuyerKind, ord: number): LinearCostScaling {
  if (kind === AutobuyerKind.Matter)
    return new LinearCostScaling({
      baseCost: initialAutobuyerCostScaling[kind][ord].baseCost.sub(
        gameCache.translatedDeflationPower.cachedValue
      ),
      baseIncrease: initialAutobuyerCostScaling[kind][ord].baseIncrease.sub(player.deflation.min(4))
    });
  if (kind === AutobuyerKind.DeflationPower) return initialAutobuyerCostScaling[kind][ord];
  if(kind === AutobuyerKind.MatterAutobuyer) return initialAutobuyerCostScaling[kind][ord]
  else throw TypeError(`invalid AutobuyerKind: ${kind}`);
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
    }),
    new ExponentialCostScaling({
      baseCost: new Decimal(1e8),
      baseIncrease: new Decimal(1000)
    })
  ],
  deflationPower: [
    new ExponentialCostScaling({
      baseCost: new Decimal(1),
      baseIncrease: new Decimal(2)
    })
  ],
  matterAutobuyer: [
    new ExponentialCostScaling({
      baseCost: new Decimal(1e-9),
      baseIncrease: new Decimal(10)
    })
  ]
};
export function getIntervalCostScaling(kind: AutobuyerKind, ord: number) {
  if (kind === AutobuyerKind.Matter) {
    const finalIntervalCostScaling = new ExponentialCostScaling({
      baseCost: initialIntervalCostScaling[kind][ord].baseCost,
      baseIncrease: initialIntervalCostScaling[kind][ord].baseIncrease
    });
    if (player.upgrades.overflow[3].amount.gt(0))
      finalIntervalCostScaling.baseCost = finalIntervalCostScaling.baseCost.div(
        gameCache.upgradeEffectValue.overflow[3].cachedValue
      );
    return finalIntervalCostScaling;
  }
  if(kind === AutobuyerKind.DeflationPower || kind === AutobuyerKind.MatterAutobuyer) return initialIntervalCostScaling[kind][ord];
  else throw TypeError(`Invalid AutobuyerKind: ${kind}`)
}
export const autobuyerName = {
  matter: ['Autoclicker', 'Autobuyer 1'],
  deflationPower: ['Deflation Power Autoclicker'],
  matterAutobuyer: ['Matter Autobuyer Autobuyer']
};
export const autobuyerCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter, CurrencyKind.Matter],
  deflationPower: [CurrencyKind.Deflator],
  matterAutobuyer: [CurrencyKind.OverflowPoint]
};
export const intervalCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter, CurrencyKind.Matter],
  deflationPower: [CurrencyKind.Deflator],
  matterAutobuyer: [CurrencyKind.Energy]
};
export const initialInterval = {
  matter: [new Decimal(1), new Decimal(2), new Decimal(4)],
  deflationPower: [new Decimal(0.5)],
  matterAutobuyer: [new Decimal(1)]
};
//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export enum AutobuyerKind {
  Matter = 'matter',
  DeflationPower = 'deflationPower',
  MatterAutobuyer = 'matterAutobuyer'
}
export interface AutobuyerData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  interval: Decimal;
  intervalAmount: Decimal;
  toggle: boolean;
  option?: {
    [propName: string]: unknown
  }
}
export function ToggleAutobuyer(kind: AutobuyerKind, ord: number) {
  player.autobuyers[kind][ord].toggle = !player.autobuyers[kind][ord].toggle;
}
export function BuyAutobuyer(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = autobuyerCurrency[kind][ord];
  const cost = getAutobuyerCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(buyAmount);
}
export function BuyInterval(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = intervalCurrency[kind][ord];
  const cost = getIntervalCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].intervalAmount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].intervalAmount =
    player.autobuyers[kind][ord].intervalAmount.add(buyAmount);
}
export function getIntervalMultiplierByBying(kind: AutobuyerKind, ord: number) {
  if(kind===AutobuyerKind.Matter || kind===AutobuyerKind.DeflationPower)
    return new Decimal(2).add(gameCache.upgradeEffectValue.overflow[2].cachedValue).recip();
  return new Decimal(0.5)
}
export function AutobuyerTick(kind: AutobuyerKind, ord: number, timeS: Decimal) {
  let finalInterval = initialInterval[kind][ord].mul(
    getIntervalMultiplierByBying(kind, ord).pow(player.autobuyers[kind][ord].intervalAmount)
  );
  if (kind === AutobuyerKind.DeflationPower) {
    finalInterval = finalInterval.div(
      player.deflation
        .add(1)
        .mul(Decimal.dOne.add(gameCache.upgradeEffectValue.overflow[4].cachedValue))
    );
  }
  player.autobuyers[kind][ord].interval = finalInterval;
  const totalTime = timeS.add(player.autobuyers[kind][ord].timer ?? Decimal.dZero);
  player.autobuyers[kind][ord].timer = totalTime.mod(player.autobuyers[kind][ord].interval, true);
  const activationAmount = totalTime.div(player.autobuyers[kind][ord].interval).floor();
  if (!player.autobuyers[kind][ord].toggle) return;
  if (activationAmount.eq(Decimal.dZero)) return;
  if (kind === AutobuyerKind.Matter) {
    if (ord === 0) {
      addCurrency(CurrencyKind.Matter, activationAmount.mul(player.autobuyers[kind][ord].amount));
    } else {
      if (player.autobuyers[kind][ord].amount.eq(0)) return;
      BuyAutobuyer(
        kind,
        ord - 1,
        activationAmount.mul(player.autobuyers[kind][ord].amount).min(
          getAutobuyerCostScaling(kind, ord - 1)
            .getAvailablePurchases(player.autobuyers[kind][ord - 1].amount, player.matter)
            .max(0)
            .floor()
        )
      );
    }
  } else if (kind === AutobuyerKind.DeflationPower) {
    if (ord === 0) {
      addCurrency(
        CurrencyKind.DeflationPower,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    }
  } else if (kind === AutobuyerKind.MatterAutobuyer) {
    const selectedOrd = Number(player.autobuyers.matterAutobuyer[0].option?.selectedOrd);
    if(ord === 0) BuyAutobuyer(AutobuyerKind.Matter, selectedOrd, activationAmount.mul(player.autobuyers[kind][ord].amount).min(
          getAutobuyerCostScaling(AutobuyerKind.Matter, selectedOrd)
            .getAvailablePurchases(player.autobuyers[AutobuyerKind.Matter][selectedOrd].amount, player.matter)
            .max(0)
            .floor()
        ))
  }
}
