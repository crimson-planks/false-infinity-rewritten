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
  ]
} as const satisfies {
  [key in AutobuyerKind]: AutobuyerConstData[];
};
Object.freeze(autobuyerConstObj);
