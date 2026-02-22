import Decimal from "break_eternity.js";
import { type CurrencyKind } from "./currency";
import { CostScaling, LinearCostScaling, ExponentialCostScaling } from "./cost";
import { CurrencyKindObj } from "./currency";
import type { AutobuyerKind } from "./autobuyer";
export interface AutobuyerConstData {
  name: string;

  currency: CurrencyKind;
  initialCostScaling: CostScaling;

  initialInterval: Decimal;
  intervalCurrency: CurrencyKind;
  initialIntervalCostScaling: CostScaling;
}
export const autobuyerConstObj = {
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
  [key in AutobuyerKind]: AutobuyerConstData[];
};