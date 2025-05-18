import Decimal from '@/lib/break_eternity.js';
import { AutobuyerKind, type AutobuyerData } from '@/autobuyer';
export interface Player {
  currentTime: number;
  matter: Decimal;
  deflation: Decimal;
  deflator: Decimal;
  deflationPower: Decimal;
  previousSacrificeDeflationPower: Decimal;
  autobuyers: {
    matter: AutobuyerData[];
    deflationPower: AutobuyerData[];
  };
}

export function getDefaultPlayer(): Player {
  return {
    currentTime: 0,
    matter: new Decimal(),
    deflation: new Decimal(),
    deflationPower: new Decimal(),
    previousSacrificeDeflationPower: new Decimal(),
    deflator: new Decimal(),
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