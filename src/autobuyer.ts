/** @prettier */
import Decimal from 'break_eternity.js';
import { CostScaling, ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import { addCurrency, type CurrencyKind, CurrencyKindObj, getCurrency, setCurrency } from './currency';
import { gameCache } from './cache';
//You can safely remove these objects
/*export const initialAutobuyerCostScaling = {
  matter: [
    new LinearCostScaling({
      baseCost: 10,
      baseIncrease: 5
    }),
    new LinearCostScaling({
      baseCost: 500,
      baseIncrease: 100
    }),
    new LinearCostScaling({
      baseCost: 1e7,
      baseIncrease: 1e6
    })
  ],
  deflationPower: [
    new LinearCostScaling({
      baseCost: 1,
      baseIncrease: 0
    })
  ],
  matterAutobuyer: [
    new LinearCostScaling({
      baseCost: 10,
      baseIncrease: 50
    })
  ]
} as const;*/
export function getAutobuyerCostScaling(kind: AutobuyerKind, ord: number): CostScaling {
  const ics = autobuyerConstData[kind][ord].initialCostScaling;
  if (kind === AutobuyerKindObj.Matter)
    return new LinearCostScaling({
      baseCost: ics.baseCost.sub(
        gameCache.translatedDeflationPower.cachedValue
      ),
      baseIncrease: ics.baseIncrease.sub(player.deflation.min(4))
    });
  if (kind === AutobuyerKindObj.DeflationPower) return ics;
  if (kind === AutobuyerKindObj.MatterAutobuyer) return ics;
  else {
    let leftover: never = kind;
    throw new TypeError(`invalid AutobuyerKind: ${kind}`);
  }
}
/*export const initialIntervalCostScaling = {
  matter: [
    new ExponentialCostScaling({
      baseCost: 100,
      baseIncrease: 10
    }),
    new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: 100
    }),
    new ExponentialCostScaling({
      baseCost: 1e8,
      baseIncrease: 1000
    })
  ],
  deflationPower: [
    new ExponentialCostScaling({
      baseCost: 1,
      baseIncrease: 2
    })
  ],
  matterAutobuyer: [
    new ExponentialCostScaling({
      baseCost: 1e-9,
      baseIncrease: 10
    })
  ]
} as const;*/
export function getIntervalCostScaling(kind: AutobuyerKind, ord: number) {
  const iics = autobuyerConstData[kind][ord].initialIntervalCostScaling
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
/*
export const autobuyerName = {
  matter: ['Autoclicker', 'Autobuyer 1'],
  deflationPower: ['Deflation Power Autoclicker'],
  matterAutobuyer: ['Matter Autobuyer Autobuyer']
};*/
/*export const autobuyerCurrency = {
  matter: [CurrencyKindObj.matter, CurrencyKindObj.matter, CurrencyKindObj.matter],
  deflationPower: [CurrencyKindObj.Deflator],
  matterAutobuyer: [CurrencyKindObj.OverflowPoint]
} as const;*/
/*export const intervalCurrency = {
  matter: [CurrencyKindObj.matter, CurrencyKindObj.matter, CurrencyKindObj.matter],
  deflationPower: [CurrencyKindObj.Deflator],
  matterAutobuyer: [CurrencyKindObj.Energy]
} as const;*/
export const initialInterval = {
  matter: [new Decimal(1), new Decimal(2), new Decimal(4)],
  deflationPower: [new Decimal(0.5)],
  matterAutobuyer: [new Decimal(1)]
} as const;
//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export const AutobuyerKindObj = {
  Matter: 'matter',
  DeflationPower: 'deflationPower',
  MatterAutobuyer: 'matterAutobuyer'
} as const;
export type AutobuyerKind = (typeof AutobuyerKindObj)[keyof typeof AutobuyerKindObj];
export interface AutobuyerConstData {
  name: string;

  currency: CurrencyKind;
  initialCostScaling: CostScaling;

  initialInterval: Decimal;
  intervalCurrency: CurrencyKind;
  initialIntervalCostScaling: CostScaling;
}
export const autobuyerConstData = {
  matter: [
    {
      name: 'Autoclicker',

      currency: CurrencyKindObj.matter,
      initialCostScaling: new LinearCostScaling({
        baseCost: 10,
        baseIncrease: 5
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.matter,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 100,
        baseIncrease: 10
      })
    },
    {
      name: 'Autobuyer 1',

      currency: CurrencyKindObj.matter,
      initialCostScaling: new LinearCostScaling({
        baseCost: 500,
        baseIncrease: 100
      }),

      initialInterval: new Decimal(2),
      intervalCurrency: CurrencyKindObj.matter,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1000,
        baseIncrease: 100
      }),
    },
    {
      name: 'Autobuyer 2',

      currency: CurrencyKindObj.matter,
      initialCostScaling: new LinearCostScaling({
        baseCost: 1e7,
        baseIncrease: 1e6
      }),

      initialInterval: new Decimal(4),
      intervalCurrency: CurrencyKindObj.matter,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e8,
        baseIncrease: 1000
      })
    }
  ],
  deflationPower: [
    {
      name: 'Deflation Power Autoclicker',

      currency: CurrencyKindObj.deflator,
      initialCostScaling: new LinearCostScaling({
        baseCost: 1,
        baseIncrease: 0
      }),

      initialInterval: new Decimal(0.5),
      intervalCurrency: CurrencyKindObj.deflator,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1,
        baseIncrease: 2
      })
    }
  ],
  matterAutobuyer: [
    {
      name: 'Matter Autobuyer Autobuyer',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new LinearCostScaling({
        baseCost: 10,
        baseIncrease: 50
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e-9,
        baseIncrease: 10
      }),


    }
  ]
} as const satisfies {
  matter: AutobuyerConstData[];
  deflationPower: AutobuyerConstData[];
  matterAutobuyer: AutobuyerConstData[];
};

autobuyerConstData.matter satisfies readonly AutobuyerConstData[];
autobuyerConstData.deflationPower satisfies readonly AutobuyerConstData[];
autobuyerConstData.matterAutobuyer satisfies readonly AutobuyerConstData[];

export interface AutobuyerSaveData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  interval: Decimal;
  intervalAmount: Decimal;
  toggle: boolean;
  option?: {
    [propName: string]: unknown;
  };
}
export function ToggleAutobuyer(kind: AutobuyerKind, ord: number) {
  player.autobuyers[kind][ord].toggle = !player.autobuyers[kind][ord].toggle;
}
export function BuyAutobuyer(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = autobuyerConstData[kind][ord].currency;
  const cost = getAutobuyerCostScaling(kind, ord).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(buyAmount);
}
export function BuyInterval(kind: AutobuyerKind, ord: number, buyAmount: Decimal) {
  const currency = autobuyerConstData[kind][ord].intervalCurrency;
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
  if (kind === AutobuyerKindObj.Matter || kind === AutobuyerKindObj.DeflationPower)
    return new Decimal(2).add(gameCache.upgradeEffectValue.overflow[2].cachedValue).recip();
  return new Decimal(0.5);
}
export function AutobuyerTick(kind: AutobuyerKind, ord: number, timeS: Decimal) {
  let finalInterval = initialInterval[kind][ord].mul(
    getIntervalMultiplierByBying(kind, ord).pow(player.autobuyers[kind][ord].intervalAmount)
  );
  if (kind === AutobuyerKindObj.DeflationPower) {
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
  if (kind === AutobuyerKindObj.Matter) {
    if (ord === 0) {
      addCurrency(
        CurrencyKindObj.matter,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
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
        AutobuyerKindObj.Matter,
        selectedOrd,
        activationAmount
          .mul(player.autobuyers[kind][ord].amount)
          .min(
            getAutobuyerCostScaling(AutobuyerKindObj.Matter, selectedOrd)
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
