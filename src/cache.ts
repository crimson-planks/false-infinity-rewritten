import { getTranslatedDeflationPower } from "./deflation_power";
import Decimal from "@/lib/break_eternity";
import { canDeflationSacrifice, getDeflationPowerBoostBySacrificedDeflationPower, getDeflationPowerBoostWhenSacrifice, getDeflatorGainOnDeflation } from "./prestige";
import { OVERFLOW_UPGRADE_COUNT, upgradeEffectValueFuncArray } from "./upgrade";

export class Lazy<Type>{
  getValue: () => Type;
  _cachedValue: Type | undefined;
  defaultValue: Type;
  constructor(getValue: () => Type, defaultValue: Type){
    this.getValue = getValue;
    this.defaultValue = defaultValue;
  }
  invalidate(){
    this._cachedValue = this.getValue();
  }
  get cachedValue(){
    return this._cachedValue ?? this.defaultValue
  }
}
export const gameCache = {
  deflatorGainOnDeflation: new Lazy(getDeflatorGainOnDeflation, Decimal.dOne),
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: new Lazy(getDeflationPowerBoostBySacrificedDeflationPower, Decimal.dOne),
  translatedDeflationPowerMultiplierWhenSacrifice: new Lazy(getDeflationPowerBoostWhenSacrifice, Decimal.dOne),
  translatedDeflationPower: new Lazy(getTranslatedDeflationPower, Decimal.dZero),
  canDeflationSacrifice: new Lazy(canDeflationSacrifice, false),
  upgradeEffectValue: {
    overflow: Array(OVERFLOW_UPGRADE_COUNT).fill(0).map((v, i)=>new Lazy(upgradeEffectValueFuncArray.overflow[i], Decimal.dOne))
  }
}