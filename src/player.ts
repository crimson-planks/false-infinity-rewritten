/** @prettier */
import Decimal from 'break_eternity.js';
import { AutobuyerKind, type AutobuyerData } from '@/autobuyer';
import { UpgradeKind, type UpgradeData } from './upgrade';
import { NotationIdEnum } from './notation';
export interface Player {
  createdTime: number;
  currentTime: number;
  notationId: NotationIdEnum;
  totalMatter: Decimal;
  matter: Decimal;
  lastDeflationTime: number;
  fastestDeflationTime: number | undefined;
  deflation: Decimal;
  deflator: Decimal;
  deflationPower: Decimal;
  previousSacrificeDeflationPower: Decimal;
  isOverflowing: boolean;
  lastOverflowTime: number;
  fastestOverflowTime: number | undefined;
  overflow: Decimal;
  overflowPoint: Decimal;
  fusion: {
    matterPoured: Decimal;
    unlocked: boolean;
    matterConverted: Decimal;
    energy: Decimal;
    helium: Decimal;
  };
  autobuyers: {
    matter: AutobuyerData[];
    deflationPower: AutobuyerData[];
  };
  upgrades: {
    overflow: UpgradeData[];
  };
}

export function getDefaultPlayer(): Player {
  return {
    createdTime: Date.now(),
    currentTime: Date.now(),
    notationId: NotationIdEnum.Default,
    totalMatter: new Decimal(),
    matter: new Decimal(),
    lastDeflationTime: Date.now(),
    fastestDeflationTime: undefined,
    deflation: new Decimal(),
    deflationPower: new Decimal(),
    previousSacrificeDeflationPower: new Decimal(),
    deflator: new Decimal(),
    isOverflowing: false,
    lastOverflowTime: Date.now(),
    fastestOverflowTime: undefined,
    overflow: new Decimal(),
    overflowPoint: new Decimal(),
    fusion: {
      matterPoured: new Decimal(),
      unlocked: false,
      matterConverted: new Decimal(),
      energy: new Decimal(),
      helium: new Decimal()
    },
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
        }
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
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 1,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 2,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 3,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 4,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 5,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 6,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKind.Overflow,
          ord: 7,
          amount: new Decimal(0)
        }
      ]
    }
  };
}
export let player = getDefaultPlayer();
export function setPlayer(obj: Player) {
  Object.keys(obj).forEach((key) => {
    //@ts-ignore
    player[key] = obj[key];
  });
}
