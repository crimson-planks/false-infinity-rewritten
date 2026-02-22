import { getTranslatedDeflationPower, getTranslatedDeflationPowerExponent } from "./deflation_power";
import Decimal from "break_eternity.js";
import { canDeflationSacrifice, getDeflationPowerBoostBySacrificedDeflationPower, getDeflationPowerBoostWhenSacrifice, getDeflatorGainOnDeflation } from "./prestige";
import { OVERFLOW_UPGRADE_COUNT, upgradeConstData } from "./upgrade";

export class Lazy<Type>{
  getValue: () => Type;
  _cachedValue: Type | undefined;
  defaultValue: Type;
  dependencies: Lazy<any>[];
  constructor(getValue: () => Type, defaultValue: Type, dependencies: Lazy<any>[] = []){
    this.getValue = getValue;
    this.defaultValue = defaultValue;
    this.dependencies = dependencies;
  }
  invalidate(){
    this._cachedValue = this.getValue();
  }
  get cachedValue(){
    return this._cachedValue ?? this.defaultValue
  }
}
//
export const gameCache = {
  deflatorGainOnDeflation: new Lazy(getDeflatorGainOnDeflation, Decimal.dOne),
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: new Lazy(getDeflationPowerBoostBySacrificedDeflationPower, Decimal.dOne),
  translatedDeflationPowerMultiplierWhenSacrifice: new Lazy(getDeflationPowerBoostWhenSacrifice, Decimal.dOne),
  translatedDeflationPower: new Lazy(getTranslatedDeflationPower, Decimal.dZero),
  canDeflationSacrifice: new Lazy(canDeflationSacrifice, false),
  upgradeEffectValue: {
    overflow: Array(OVERFLOW_UPGRADE_COUNT).fill(0).map((v, i)=>new Lazy(upgradeConstData.overflow[i].effectValueFunction, Decimal.dOne))
  }
}