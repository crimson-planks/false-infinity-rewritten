import Decimal from "break_eternity.js";
import { getTotalOverflowExtension } from "./extend_overflow";
import { player } from "./player";
import { overflowReset } from "./prestige";
import { d0_1, d1 } from "./constants";
export type ChallengeType = 'overflow'
export type OverflowChallenge = 'oc1' | 'oc2' | 'oc3' | 'oc4';
export interface ChallengeConstData {
  shortName: string;
  name: string;
  unlockCondition: () => boolean;
  goal: Decimal;
  appliedExtensionLevel: undefined | Decimal;
}
export const challengeConstObj = {
  oc1: {
    shortName: 'oc1',
    name: "Overflow Challenge 1",
    unlockCondition: () => getTotalOverflowExtension().gte(1),
    goal: Decimal.dTwo.pow(31+1).sub(1),
    appliedExtensionLevel: new Decimal(1),
  },
  oc2: {
    shortName: 'oc2',
    name: "Overflow Challenge 2",
    unlockCondition: () => getTotalOverflowExtension().gte(22),
    goal: Decimal.dTwo.pow(31+22).sub(1),
    appliedExtensionLevel: new Decimal(22),
  },
  oc3: {
    shortName: 'oc3',
    name: "Overflow Challenge 3",
    unlockCondition: () => getTotalOverflowExtension().gte(48),
    goal: Decimal.dTwo.pow(31+48).sub(1),
    appliedExtensionLevel: new Decimal(48),
  },
  oc4: {
    shortName: 'oc4',
    name: 'Overflow Challenge 4',
    unlockCondition: () => getTotalOverflowExtension().gte(100),
    goal: Decimal.dTwo.pow(31+100).sub(1),
    appliedExtensionLevel: new Decimal(100),
  }
} as const satisfies {
  [oc in OverflowChallenge]: ChallengeConstData
};
Object.freeze(challengeConstObj)
export const challengeArr = ['oc1','oc2','oc3','oc4'] as const;
Object.freeze(challengeArr)

export function isInChallenge(){
  return player.currentOverflowChallenge!=undefined;
}
export function enterOverflowChallenge(oc: OverflowChallenge){
  overflowReset(true, oc);
  if(challengeConstObj[oc].appliedExtensionLevel!=undefined){
    player.extendOverflow.currentLevel = challengeConstObj[oc].appliedExtensionLevel;
  }
  player.currentOverflowChallenge = oc;
}
export function exitOverflowChallenge(){
  if(player.currentOverflowChallenge==undefined) return;
  overflowReset(true, undefined);
}
export function resetChallengeStuff(){
  player.challengeStuff.extraCostBump = [new Decimal(), new Decimal(), new Decimal()];
  player.challengeStuff.inflationPower = new Decimal(Decimal.dOne);
}

export function getOverflowChallengeCompletion(){
  let count = 0;
  challengeArr.forEach((oc)=>{
    if(player.challenges.overflow[oc].completed) count++;
  });
  return count;
}
export function updateUnlockedChallenge(){
  for(let oc of challengeArr){
    if(challengeConstObj[oc].unlockCondition()) player.challenges.overflow[oc].unlocked = true;
  }
}
export function getOc3InflationPowerMulPerSecond(){
  return d0_1.mul(player.deflation.add(1)).mul(player.autobuyers.matter[0].amount.add(1).log10().add(1)).add(1);
}