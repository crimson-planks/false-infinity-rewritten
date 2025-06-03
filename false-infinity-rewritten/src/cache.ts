import { getTranslatedDeflationPower } from "./deflation_power";
import Decimal from "@/lib/break_eternity";
import { getDeflationAutobuyerBoostWhenSacrifice } from "./prestige";

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
  translatedDeflationPower: new Lazy(getTranslatedDeflationPower, Decimal.dZero),
  deflationAutobuyerBoostWhenSacrifice: new Lazy(getDeflationAutobuyerBoostWhenSacrifice, Decimal.dZero)
}