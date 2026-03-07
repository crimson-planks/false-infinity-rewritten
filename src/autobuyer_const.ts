import Decimal from "break_eternity.js";
import type { AutobuyerKind } from "./autobuyer";
import { CostScaling, ExponentialCostScaling, LinearCostScaling } from "./cost";
import { CurrencyKindObj, type CurrencyKind } from "./currency";
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
      }),

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
        baseCost: 1,
        baseIncrease: 20
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e10,
        baseIncrease: 2
      }),
    },
    {
      name: 'Auto Deflator',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new LinearCostScaling({
        baseCost: 10,
        baseIncrease: 10
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e11,
        baseIncrease: 4
      }),

    },
    {
      name: 'Auto Maxer',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new LinearCostScaling({
        baseCost: 10,
        baseIncrease: 10
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e9,
        baseIncrease: 2
      }),

    },
    {
      name: 'Deflation Power Autobuyer Autobuyer',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new LinearCostScaling({
        baseCost: 5,
        baseIncrease: 20
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 2e10,
        baseIncrease: 3
      }),

    },
    {
      name: 'Auto Overflower',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new LinearCostScaling({
        baseCost: 100,
        baseIncrease: 100
      }),

      initialInterval: new Decimal(1),
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e12,
        baseIncrease: 5
      }),

    }
  ]
} as const satisfies {
  [key in AutobuyerKind]: AutobuyerConstData[];
};
Object.freeze(autobuyerConstObj);