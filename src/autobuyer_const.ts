import Decimal from "break_eternity.js";
import type { AutobuyerKind } from "./autobuyer";
import { ConstantCostScaling, CostScaling, ExponentialCostScaling, LinearCostScaling } from "./cost";
import { CurrencyKindObj, type CurrencyKind } from "./currency";
import { d0_05, d0_5, d4 } from "./constants";
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

      initialInterval: Decimal.dOne,
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

      initialInterval: Decimal.dTwo,
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
        baseIncrease: 2000
      }),

      initialInterval: d4,
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
      initialCostScaling: new ConstantCostScaling(1),

      initialInterval: d0_5,
      intervalCurrency: CurrencyKindObj.deflator,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 2,
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

      initialInterval: Decimal.dOne,
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

      initialInterval: Decimal.dOne,
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
        baseCost: Decimal.dTen,
        baseIncrease: Decimal.dTen
      }),

      initialInterval: Decimal.dOne,
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

      initialInterval: Decimal.dOne,
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

      initialInterval: Decimal.dOne,
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ExponentialCostScaling({
        baseCost: 1e12,
        baseIncrease: 5
      }),

    },
    {
      name: 'Auto Mole Reset',

      currency: CurrencyKindObj.overflowPoint,
      initialCostScaling: new ConstantCostScaling(1),

      initialInterval: d0_05,
      intervalCurrency: CurrencyKindObj.energy,
      initialIntervalCostScaling: new ConstantCostScaling(Decimal.dInf),
    }
  ]
} as const satisfies {
  [key in AutobuyerKind]: AutobuyerConstData[];
};
Object.freeze(autobuyerConstObj);
