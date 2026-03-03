/** @prettier */
import Decimal from 'break_eternity.js';
import { AutobuyerKindObj, type AutobuyerSaveData } from '@/autobuyer';
import { UpgradeKindObj, type UpgradeSaveData } from './upgrade';
import { NotationIdEnum, type NotationId } from './notation';
import { VERSION_STR } from './constants';
export interface Player {
  version: string;
  createdTime: number;
  currentTime: number;
  notationId: NotationId;
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
    star: Decimal;
    allocatedStar: Decimal;
    energy: Decimal;
    helium: Decimal;
  };
  autobuyers: {
    matter: AutobuyerSaveData[];
    deflationPower: AutobuyerSaveData[];
    matterAutobuyer: AutobuyerSaveData[];
  };
  upgrades: {
    overflow: UpgradeSaveData[];
  };
}

export function getDefaultPlayer(): Player {
  return {
    version: VERSION_STR,
    createdTime: Date.now(),
    currentTime: Date.now(),
    notationId: NotationIdEnum.default,
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
      star: new Decimal(),
      allocatedStar: new Decimal(),
      energy: new Decimal(),
      helium: new Decimal()
    },
    autobuyers: {
      matter: [
        {
          kind: AutobuyerKindObj.Matter,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: Decimal.dZero,
          toggle: true
        },
        {
          kind: AutobuyerKindObj.Matter,
          ord: 1,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: Decimal.dZero,
          toggle: true
        },
        {
          kind: AutobuyerKindObj.Matter,
          ord: 2,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: Decimal.dZero,
          toggle: true
        }
      ],
      deflationPower: [
        {
          kind: AutobuyerKindObj.DeflationPower,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: Decimal.dZero,
          toggle: true
        }
      ],
      matterAutobuyer: [
        {
          kind: AutobuyerKindObj.MatterAutobuyer,
          ord: 0,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: new Decimal(0),
          toggle: true,
          option: { selectedOrd: 0 }
        },
        {
          kind: AutobuyerKindObj.MatterAutobuyer,
          ord: 1,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: new Decimal(0),
          toggle: true
        },
        {
          kind: AutobuyerKindObj.MatterAutobuyer,
          ord: 2,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: new Decimal(0),
          toggle: true
        },
        {
          kind: AutobuyerKindObj.MatterAutobuyer,
          ord: 3,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: new Decimal(0),
          toggle: true
        },
        {
          kind: AutobuyerKindObj.MatterAutobuyer,
          ord: 4,
          amount: new Decimal(0),
          timer: new Decimal(0),
          intervalAmount: new Decimal(0),
          toggle: true
        }
      ]
    },
    upgrades: {
      overflow: [
        {
          kind: UpgradeKindObj.Overflow,
          ord: 0,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 1,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 2,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 3,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 4,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 5,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 6,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 7,
          amount: new Decimal(0)
        },
        {
          kind: UpgradeKindObj.Overflow,
          ord: 8,
          amount: new Decimal(0)
        }
      ]
    }
  };
}
export const player = getDefaultPlayer();
export function setPlayer(obj: Partial<Player>) {
  Object.keys(obj).forEach((key) => {
    //@ts-ignore I'll put this until I can come up with a better algorithm
    player[key] = obj[key];
  });
}
