/** @prettier */
import Decimal from '@/lib/break_eternity';
import { ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import { CurrencyKind, getCurrency, setCurrency } from './currency';
import { gameCache } from './cache';
import { getTranslatedDeflationPower } from './deflation_power';
export const initialAutobuyerCostScaling = {
  matter: [
    new LinearCostScaling({
      baseCost: new Decimal(10),
      increase: new Decimal(5)
    }),
    new LinearCostScaling({
      baseCost: new Decimal(500),
      increase: new Decimal(100)
    }),
    new LinearCostScaling({
      baseCost: new Decimal('1e7'),
      increase: new Decimal('1e6')
    })
  ],
  deflationPower: [
    new LinearCostScaling({
      baseCost: new Decimal(1),
      increase: new Decimal(0)
    })
  ]
};
export function getAutobuyerCostScaling(kind: AutobuyerKind, ord: number): LinearCostScaling {
  if (kind === AutobuyerKind.Matter)
    return new LinearCostScaling({
      baseCost: initialAutobuyerCostScaling[kind][ord].baseCost.sub(
        gameCache.translatedDeflationPower.cachedValue
      ),
      increase: initialAutobuyerCostScaling[kind][ord].increase.sub(player.deflation.min(4))
    });
  if (kind === AutobuyerKind.DeflationPower) return initialAutobuyerCostScaling[kind][ord];
  else throw Error(`invalid AutobuyerKind: ${kind}`);
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
      baseCost: new Decimal('1e8'),
      baseIncrease: new Decimal(1000)
    })
  ],
  deflationPower: [
    new ExponentialCostScaling({
      baseCost: new Decimal(1),
      baseIncrease: new Decimal(2)
    })
  ]
};
export function getIntervalCostScaling(kind: AutobuyerKind, ord: number) {
  return initialIntervalCostScaling[kind][ord];
}
export const autobuyerName = {
  matter: ['Autoclicker', 'Autobuyer 1'],
  deflationPower: ['Deflation Power Autoclicker']
};
export const autobuyerCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter, CurrencyKind.Matter],
  deflationPower: [CurrencyKind.Deflator]
};
export const intervalCurrency = {
  matter: [CurrencyKind.Matter, CurrencyKind.Matter, CurrencyKind.Matter],
  deflationPower: [CurrencyKind.Deflator]
};
export const initialInterval = {
  matter: [new Decimal(1), new Decimal(2), new Decimal(4)],
  deflationPower: [new Decimal(0.5)]
};
//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export enum AutobuyerKind {
  Matter = 'matter',
  DeflationPower = 'deflationPower'
}
export interface AutobuyerData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  interval: Decimal;
  intervalAmount: Decimal;
  toggle: boolean;
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
  const currency = autobuyerCurrency[kind][ord];
  const cost = getIntervalCostScaling(kind, ord).getTotalCostAfterPurchase(
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
  if (!player.autobuyers[kind][ord].toggle) return;
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
          getAutobuyerCostScaling(kind, ord - 1)
            .getAvailablePurchases(player.autobuyers[kind][ord - 1].amount, player.matter)
            .max(0)
            .floor()
        )
      );
    }
  } else if (kind === AutobuyerKind.DeflationPower) {
    if (ord === 0) {
      player.deflationPower = player.deflationPower.add(
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    }
  }
}
