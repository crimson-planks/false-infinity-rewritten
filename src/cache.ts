import { canDeflationSacrifice, getDeflationPowerBoostBySacrificedDeflationPower, getDeflationPowerBoostWhenSacrifice, getTranslatedDeflationPower } from "./deflation_power";
import Decimal from "break_eternity.js";
import { getDeflatorGainOnDeflation, getMatterAutobuyerCostScalingReductionByDeflation, hasDeflated, hasOverflowed } from "./prestige";
import { upgradeConstObj, type UpgradeKind } from "./upgrade";
import { autobuyerConstObj } from "./autobuyer_const";
import { type AutobuyerKind, getAutobuyerInterval } from "./autobuyer";

export class Lazy<Type>{
  getValue: () => Type;
  _cachedValue: Type | undefined;
  defaultValue: Type;
  dependencies: Lazy<any>[];
  constructor(getValue: () => Type, defaultValue?: Type, dependencies: Lazy<any>[] = []){
    this.getValue = getValue;
    this.defaultValue = defaultValue ?? this.getValue();
    this.dependencies = dependencies;
  }
  invalidate(){
    this._cachedValue = this.getValue();
  }
  get cachedValue(){
    return this._cachedValue ?? this.defaultValue
  }
}
export function getUpgradeEffectValueCachedValue(kind: UpgradeKind, ord: number){
  return gameCache_upgradeEffectValue[kind][ord].cachedValue;
}
export const gameCache_upgradeEffectValue = {
   overflow: Array(upgradeConstObj.overflow.length).fill(0).map((v, i)=>new Lazy(upgradeConstObj.overflow[i].effectValueFunction, new Decimal(Decimal.dOne))),
   helium:  Array(upgradeConstObj.helium.length).fill(0).map((v, i)=>new Lazy(upgradeConstObj.helium[i].effectValueFunction, new Decimal(Decimal.dZero))),
}
export const gameCache: {
  deflatorGainOnDeflation: Lazy<Decimal>;
hasDeflated: Lazy<boolean>;
hasOverflowed: Lazy<boolean>;
matterAutobuyerCostScalingReductionByDeflation: Lazy<Decimal>;
translatedDeflationPowerMultiplierBySacrificedDeflationPower: Lazy<Decimal>;
translatedDeflationPowerMultiplierWhenSacrifice: Lazy<Decimal>;
translatedDeflationPower: Lazy<Decimal>;
canDeflationSacrifice: Lazy<boolean>;
upgradeEffectValue: {
  overflow: Lazy<Decimal>[];
  helium: Lazy<Decimal>[];
}
autobuyerInterval: {
  matter: Lazy<Decimal>[];
  deflationPower: Lazy<Decimal>[];
  matterAutobuyer: Lazy<Decimal>[];
}
} = {
  deflatorGainOnDeflation: new Lazy(getDeflatorGainOnDeflation, new Decimal(Decimal.dOne)),
  hasDeflated: new Lazy(hasDeflated, false),
  hasOverflowed: new Lazy(hasOverflowed, false),
  matterAutobuyerCostScalingReductionByDeflation: new Lazy(getMatterAutobuyerCostScalingReductionByDeflation, new Decimal(Decimal.dZero)),
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: new Lazy(getDeflationPowerBoostBySacrificedDeflationPower, new Decimal(Decimal.dOne)),
  translatedDeflationPowerMultiplierWhenSacrifice: new Lazy(getDeflationPowerBoostWhenSacrifice, new Decimal(Decimal.dOne)),
  translatedDeflationPower: new Lazy(getTranslatedDeflationPower, new Decimal(Decimal.dZero)),
  canDeflationSacrifice: new Lazy(canDeflationSacrifice, false),
  upgradeEffectValue: gameCache_upgradeEffectValue,
  autobuyerInterval: {
    matter: Array(autobuyerConstObj.matter.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval({kind: 'matter',ord: i}), new Decimal(Decimal.dOne))),
    deflationPower: Array(autobuyerConstObj.deflationPower.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval({kind: 'deflationPower',ord: i}), new Decimal(Decimal.dOne))),
    matterAutobuyer: Array(autobuyerConstObj.matterAutobuyer.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval({kind: 'matterAutobuyer',ord: i}), new Decimal(Decimal.dOne))),
  }
};
gameCache.autobuyerInterval satisfies {
  [key in AutobuyerKind]: Lazy<Decimal>[];
}