import Decimal from '@/lib/break_eternity.js';
import { ref, type Ref } from 'vue';
import { AutobuyerKind, type AutobuyerData } from '@/autobuyer';
import { LinearCostScaling } from './cost';
export interface Player {
  currentTime: number;
  matter: Decimal;
  autobuyers: {
    matter: AutobuyerData[];
  };
}

export function getDefaultPlayer(): Player {
  return {
    currentTime: 0,
    matter: new Decimal(),
    autobuyers: {
      matter: [
        {
          kind: AutobuyerKind.Matter,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(1),
          costScaling: new LinearCostScaling({
            baseCost: new Decimal(10),
            baseIncrease: new Decimal(5)
          })
        }
      ]
    }
  };
};
export const player = getDefaultPlayer();