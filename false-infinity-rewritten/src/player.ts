import Decimal from '@/lib/break_eternity.js';
import { AutobuyerKind, type AutobuyerData } from '@/autobuyer';
export interface Player {
  currentTime: number;
  matter: Decimal;
  deflation: Decimal;
  autobuyers: {
    matter: AutobuyerData[];
  };
}

export function getDefaultPlayer(): Player {
  return {
    currentTime: 0,
    matter: new Decimal(),
    deflation: new Decimal(),
    autobuyers: {
      matter: [
        {
          kind: AutobuyerKind.Matter,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(1),
          intervalAmount: Decimal.dZero
        },
        {
          kind: AutobuyerKind.Matter,
          ord: 1,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(2),
          intervalAmount: Decimal.dZero
        }
      ]
    }
  };
};
export const player = getDefaultPlayer();