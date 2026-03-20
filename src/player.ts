/** @prettier */
import Decimal from 'break_eternity.js';
import { AutobuyerKindObj, getDefaultAutobuyerSaveData, type AutobuyerSaveData } from '@/autobuyer';
import { getDefaultUpgradeSaveData, UpgradeKindObj, type UpgradeSaveData } from './upgrade';
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
    isFusing: boolean;
    star: Decimal;
    allocatedStar: Decimal;
    energy: Decimal;
    helium: Decimal;
  };
  extendOverflow: {
    currentLevel: Decimal;
    matter: Decimal;
    deflationPower: Decimal;
    overflowPoint: Decimal;
  }
  autobuyers: {
    matter: AutobuyerSaveData[];
    deflationPower: AutobuyerSaveData[];
    matterAutobuyer: AutobuyerSaveData[];
  };
  upgrades: {
    overflow: UpgradeSaveData[];
    helium: UpgradeSaveData[];
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
      isFusing: false,
      star: new Decimal(),
      allocatedStar: new Decimal(),
      energy: new Decimal(),
      helium: new Decimal()
    },
    extendOverflow: {
      currentLevel: new Decimal(),
      matter: new Decimal(),
      deflationPower: new Decimal(),
      overflowPoint: new Decimal()
    },
    autobuyers: {
      matter: [
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.Matter, ord: 0}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.Matter, ord: 1}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.Matter, ord: 2}),
      ],
      deflationPower: [
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.DeflationPower, ord: 0}),
      ],
      matterAutobuyer: [
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.MatterAutobuyer, ord: 0}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.MatterAutobuyer, ord: 1}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.MatterAutobuyer, ord: 2}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.MatterAutobuyer, ord: 3}),
        getDefaultAutobuyerSaveData({kind: AutobuyerKindObj.MatterAutobuyer, ord: 4}),
      ]
    },
    upgrades: {
      overflow: [
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 0}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 1}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 2}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 3}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 4}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 5}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 6}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 7}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.Overflow, ord: 8}),
      ],
      helium: [
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.helium, ord: 0}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.helium, ord: 1}),
        getDefaultUpgradeSaveData({kind: UpgradeKindObj.helium, ord: 2})
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
