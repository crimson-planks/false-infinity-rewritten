import Decimal from '@/lib/break_eternity.js';
import { AutobuyerKind, type AutobuyerData } from '@/autobuyer';
import { UpgradeKind, type UpgradeData } from './upgrade';
export interface Player {
  currentTime: number;
  matter: Decimal;
  deflation: Decimal;
  deflator: Decimal;
  deflationPower: Decimal;
  previousSacrificeDeflationPower: Decimal;
  isOverflowing: boolean;
  overflow: Decimal;
  overflowPoint: Decimal;
  autobuyers: {
    matter: AutobuyerData[];
    deflationPower: AutobuyerData[];
  };
  upgrades: {
    overflow: UpgradeData[]
  }
}

export function getDefaultPlayer(): Player {
  return {
    currentTime: 0,
    matter: new Decimal(),
    deflation: new Decimal(),
    deflationPower: new Decimal(),
    previousSacrificeDeflationPower: new Decimal(),
    deflator: new Decimal(),
    isOverflowing: false,
    overflow: new Decimal(),
    overflowPoint: new Decimal(),
    autobuyers: {
      matter: [
        {
          kind: AutobuyerKind.Matter,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(1),
          intervalAmount: Decimal.dZero,
          toggle: true
        },
        {
          kind: AutobuyerKind.Matter,
          ord: 1,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(2),
          intervalAmount: Decimal.dZero,
          toggle: true
        },
        {
          kind: AutobuyerKind.Matter,
          ord: 2,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(4),
          intervalAmount: Decimal.dZero,
          toggle: true
        },
      ],
      deflationPower: [
        {
          kind: AutobuyerKind.DeflationPower,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          interval: new Decimal(4),
          intervalAmount: Decimal.dZero,
          toggle: true
        }
      ]
    },
    upgrades: {
      overflow: [
        {
          kind: UpgradeKind.Overflow,
          ord: 0,
          amount: new Decimal(0)
        }
      ]
    }
  };
};
export let player = getDefaultPlayer();
export function setPlayer(obj: Player){
  Object.keys(obj).forEach((key) => {
    //@ts-ignore
    player[key] = obj[key];
  });
}