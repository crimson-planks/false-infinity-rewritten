/** @prettier */
import Decimal from 'break_eternity.js';
import { CostScaling, ExponentialCostScaling, LinearCostScaling } from './cost';
import { player } from './player';
import {
  addCurrency, CurrencyKindObj,
  getCurrency,
  setCurrency
} from './currency';
import { autobuyerConstObj } from './autobuyer_const';
import { gameCache, gameCache_upgradeEffectValue } from './cache';
import { deflationReset, getMatterAutobuyerCostScalingReductionByDeflation, getPossibleDeflateAmount, moleReset, overflowReset } from './prestige';
import { upgradeConstObj } from './upgrade';
import { getOverflowChallengeCompletion } from './challenge';
import { d0_5 } from './constants';

export function getAutobuyerCostScaling({ kind, ord }: AutobuyerLocation): CostScaling {
  const ics = autobuyerConstObj[kind][ord].initialCostScaling;
  if (kind === AutobuyerKindObj.Matter){
    if(!(ics instanceof LinearCostScaling)) return ics; //this should never happen
    return new LinearCostScaling({
      baseCost: ics.baseCost.sub(gameCache.translatedDeflationPower.cachedValue).add(player.currentOverflowChallenge=='oc3' ? player.challengeStuff.inflationPower : Decimal.dZero),
      baseIncrease: ics.baseIncrease.sub(getMatterAutobuyerCostScalingReductionByDeflation())
    });
  }
  else if (kind === AutobuyerKindObj.DeflationPower) return ics;
  else if (kind === AutobuyerKindObj.MatterAutobuyer) return ics;
  else {
    let leftover: never = kind;
    throw new TypeError(`invalid AutobuyerKind: ${kind}`);
  }
}

export function getIntervalCostScaling({ kind, ord }: AutobuyerLocation) {
  const iics = autobuyerConstObj[kind][ord].initialIntervalCostScaling;
  if (kind === AutobuyerKindObj.Matter) {
    if(!(iics instanceof ExponentialCostScaling)) return iics; //this should never happen
    const finalIntervalCostScaling = new ExponentialCostScaling({
      baseCost: iics.baseCost,
      baseIncrease: iics.baseIncrease
    });
    if (player.upgrades.overflow[3].amount.gt(0))
      finalIntervalCostScaling.baseCost = finalIntervalCostScaling.baseCost.div(
        gameCache_upgradeEffectValue.overflow[3].cachedValue
      );
    if (player.currentOverflowChallenge==='oc2'){
      finalIntervalCostScaling.baseCost = finalIntervalCostScaling.baseCost.mul(finalIntervalCostScaling.baseIncrease.pow(player.challengeStuff.extraCostBump[ord]));
    }
    return finalIntervalCostScaling;
  }
  if (kind === AutobuyerKindObj.DeflationPower || kind === AutobuyerKindObj.MatterAutobuyer)
    return iics;
  else {
    let leftover: never = kind;
    throw new TypeError(`Invalid AutobuyerKind: ${kind}`);
  }
}

//all the methods here only change its internal state
//the functionality that changes external state are in seperate functions
export const AutobuyerKindObj = {
  Matter: 'matter',
  DeflationPower: 'deflationPower',
  MatterAutobuyer: 'matterAutobuyer'
} as const;
Object.freeze(AutobuyerKindObj);
export type AutobuyerKind = (typeof AutobuyerKindObj)[keyof typeof AutobuyerKindObj];
export const AutobuyerKindArr = [
  'matter',
  'deflationPower',
  'matterAutobuyer'
] as const satisfies AutobuyerKind[];
Object.freeze(AutobuyerKindArr);
export interface AutobuyerSaveData {
  kind: AutobuyerKind;
  ord: number;
  amount: Decimal;
  timer: Decimal;
  intervalAmount: Decimal;
  toggle: boolean;
  option?: {
    [propName: string]: unknown;
  };
}
export interface AutobuyerLocation {
  kind: AutobuyerKind;
  ord: number;
}
export function getDefaultAutobuyerSaveData(loc: AutobuyerLocation): AutobuyerSaveData{
  return {
    kind: loc.kind,
    ord: loc.ord,
    amount: new Decimal(Decimal.dZero),
    timer: new Decimal(Decimal.dZero),
    intervalAmount: new Decimal(Decimal.dZero),
    toggle: true
  }
}
export function isAutobuyerUnlocked(loc: AutobuyerLocation){
  const {kind, ord} = loc;
  if(kind==='matter'){
    if(ord===0||ord===1) return true;
    else if(ord===2) return gameCache_upgradeEffectValue.overflow[8].cachedValue.gt(0) ?? false;
    else return false;
  }
  else if(kind==='deflationPower'){
    return gameCache.hasDeflated.cachedValue;
  }
  else if(kind==='matterAutobuyer'){
    if(ord===5) return gameCache.hasOverflowed.cachedValue && player.challenges.overflow.oc4.completed;
    return gameCache.hasOverflowed.cachedValue;
  }
  else{
    let leftover: never = kind;
    console.error(TypeError(`Unknown AutobuyerKind: ${kind}`));
    return false;
  }
}
export function ToggleAutobuyer(loc: AutobuyerLocation) {
  const { kind, ord } = loc;
  player.autobuyers[kind][ord].toggle = !player.autobuyers[kind][ord].toggle;
}
export function BuyAutobuyer(loc: AutobuyerLocation, buyAmount: Decimal) {
  if(!isAutobuyerUnlocked(loc)) return;
  const { kind, ord } = loc;
  const currency = autobuyerConstObj[kind][ord].currency;
  const cost = getAutobuyerCostScaling(loc).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].amount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(buyAmount);
}
/** Buys `buyAmount` if possible, if not possible, buys the maximum amount that can be bought.
 */
export function BuyPossibleAutobuyer(loc: AutobuyerLocation, buyAmount: Decimal) {
  if(!isAutobuyerUnlocked(loc)) return;
  const {kind, ord} = loc;
  const currency = autobuyerConstObj[kind][ord].currency;
  const acs = getAutobuyerCostScaling(loc);
  const possibleMaxAmount = acs.getAvailablePurchases(player.autobuyers[kind][ord].amount, getCurrency(currency)).floor();
  const actualBuyAmount = possibleMaxAmount.min(buyAmount);
  const cost = acs.getTotalCostAfterPurchase(player.autobuyers[kind][ord].amount, actualBuyAmount);
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].amount = player.autobuyers[kind][ord].amount.add(actualBuyAmount);
}
export function BuyInterval(loc: AutobuyerLocation, buyAmount: Decimal) {
  if(!isAutobuyerUnlocked(loc)) return;
  const { kind, ord } = loc;
  const currency = autobuyerConstObj[kind][ord].intervalCurrency;
  const cost = getIntervalCostScaling({ kind, ord }).getTotalCostAfterPurchase(
    player.autobuyers[kind][ord].intervalAmount,
    buyAmount
  );
  if (cost.gt(getCurrency(currency))) return;
  setCurrency(currency, getCurrency(currency).sub(cost));
  player.autobuyers[kind][ord].intervalAmount =
    player.autobuyers[kind][ord].intervalAmount.add(buyAmount);
  if(player.currentOverflowChallenge==='oc2' && kind==='matter'){
    for(let i=0;i<player.challengeStuff.extraCostBump.length;i++){
      if(ord===i) continue;
      player.challengeStuff.extraCostBump[i] = player.challengeStuff.extraCostBump[i].add(buyAmount);
    }
  }
}
export function BuyMaxInterval(loc: AutobuyerLocation) {
  if(!isAutobuyerUnlocked(loc)) return;
  const { kind, ord } = loc;
  BuyInterval(
    loc,
    getIntervalCostScaling(loc)
      .getAvailablePurchases(
        player.autobuyers[kind][ord].intervalAmount,
        getCurrency(autobuyerConstObj[kind][ord].intervalCurrency)
      )
      .max(0)
      .floor()
  );
}
export function ClickMaxMatterAutobuyerInterval() {
  if(player.isOverflowing) return;
  for (let i = 0; i < autobuyerConstObj.matter.length; i++) {
    BuyMaxInterval({ kind: AutobuyerKindObj.Matter, ord: i });
  }
}
export function getIntervalMultiplierByBying(loc: AutobuyerLocation) {
  const {kind, ord} = loc;
  if (kind === AutobuyerKindObj.Matter)
    return Decimal.dTwo.mul(player.mole.pow_base(1.05)).recip();
  return d0_5;
}
export function getDeflationPowerAutobuyerIntervalDivideExponentByDeflation(){
  return new Decimal(getOverflowChallengeCompletion()).add(1);
}
export function getDeflationPowerAutobuyerIntervalDivideByDeflation(){
  return player.deflation
        .add(1)
        .pow(getDeflationPowerAutobuyerIntervalDivideExponentByDeflation());
}
export function getAutobuyerInterval(loc: AutobuyerLocation) {
  const { kind, ord } = loc;
  let interval = autobuyerConstObj[kind][ord].initialInterval.mul(
    getIntervalMultiplierByBying(loc).pow(player.autobuyers[kind][ord].intervalAmount)
  );
  if (kind === AutobuyerKindObj.Matter){
    if(ord===0 && player.upgrades.overflow[2].amount.gt(0)) interval = interval.div(upgradeConstObj.overflow[2].effectValueFunction());
    if(ord===0 && player.upgrades.overflow[4].amount.gt(0)) interval = interval.div(upgradeConstObj.overflow[4].effectValueFunction());
  }
  if (kind === AutobuyerKindObj.DeflationPower) {
    interval = interval.div(
      getDeflationPowerAutobuyerIntervalDivideByDeflation()
    );
  }
  return interval;
}

export function AutobuyerTick(loc: AutobuyerLocation, timeS: Decimal) {
  const { kind, ord } = loc;
  if (!player.autobuyers[kind][ord].toggle || player.autobuyers[kind][ord].amount.eq(0)) return;
  const interval = getAutobuyerInterval(loc);
  const totalTime = timeS.add(player.autobuyers[kind][ord].timer ?? Decimal.dZero);
  player.autobuyers[kind][ord].timer = totalTime.mod(interval, true);
  const activationAmount = totalTime.div(interval).floor();
  if (activationAmount.eq(Decimal.dZero)) return;
  if (kind === AutobuyerKindObj.Matter) {
    if (ord === 0) {
      addCurrency(
        CurrencyKindObj.matter,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    } else {
      if (player.autobuyers[kind][ord].amount.eq(0)) return;
      BuyAutobuyer(
        { kind: kind, ord: ord - 1 },
        activationAmount.mul(player.autobuyers[kind][ord].amount).min(
          getAutobuyerCostScaling({ kind: kind, ord: ord - 1 })
            .getAvailablePurchases(player.autobuyers[kind][ord - 1].amount, player.matter)
            .max(0)
            .floor()
        )
      );
    }
  } else if (kind === AutobuyerKindObj.DeflationPower) {
    if (ord === 0) {
      addCurrency(
        CurrencyKindObj.deflationPower,
        activationAmount.mul(player.autobuyers[kind][ord].amount)
      );
    }
  } else if (kind === AutobuyerKindObj.MatterAutobuyer) {
    if (ord === 0){
      const l = player.autobuyers.matter.length;
      for(let i=0;i<l;i++){
        BuyAutobuyer(
          { kind: AutobuyerKindObj.Matter, ord: i },
          activationAmount
            .mul(player.autobuyers[kind][ord].amount)
            .min(
              getAutobuyerCostScaling({ kind: AutobuyerKindObj.Matter, ord: i })
                .getAvailablePurchases(
                  player.autobuyers[AutobuyerKindObj.Matter][i].amount,
                  player.matter
                )
                .max(0)
                .floor()
            )
        );
      }
    }
    if (ord === 1) {
      deflationReset(false, activationAmount.mul(player.autobuyers[kind][ord].amount).min(getPossibleDeflateAmount()));
    }
    if (ord === 2) {
      const ml = autobuyerConstObj.matter.length;
      for (let i = 0; i < ml; i++) {
        BuyMaxInterval({ kind: AutobuyerKindObj.Matter, ord: i });
      }
      const dl = autobuyerConstObj.deflationPower.length;
      for (let i = 0; i < dl; i++) {
        BuyMaxInterval({ kind: AutobuyerKindObj.DeflationPower, ord: i });
      }
    }
    if (ord === 3) {
      const l = autobuyerConstObj.deflationPower.length;
      for(let i=0; i<l; i++){
        BuyPossibleAutobuyer({ kind: AutobuyerKindObj.DeflationPower, ord: i},
          activationAmount.mul(player.autobuyers[kind][ord].amount)
        );
      }
    }
    if (ord === 4) {
      overflowReset();
    }
    if (ord === 5){
      moleReset();
    }
  }
}
