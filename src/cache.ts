import { getTranslatedDeflationPower, getTranslatedDeflationPowerExponent } from "./deflation_power";
import Decimal from "break_eternity.js";
import { canDeflationSacrifice, getDeflationPowerBoostBySacrificedDeflationPower, getDeflationPowerBoostWhenSacrifice, getDeflatorGainOnDeflation } from "./prestige";
import { OVERFLOW_UPGRADE_COUNT, upgradeConstObj } from "./upgrade";
import { player } from "./player";
import { autobuyerConstObj } from "./autobuyer_const";
import { type AutobuyerKind,AutobuyerKindObj, getAutobuyerInterval } from "./autobuyer";

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
//
export const gameCache = {
  deflatorGainOnDeflation: new Lazy(getDeflatorGainOnDeflation, Decimal.dOne),
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: new Lazy(getDeflationPowerBoostBySacrificedDeflationPower, Decimal.dOne),
  translatedDeflationPowerMultiplierWhenSacrifice: new Lazy(getDeflationPowerBoostWhenSacrifice, Decimal.dOne),
  translatedDeflationPower: new Lazy(getTranslatedDeflationPower, Decimal.dZero),
  canDeflationSacrifice: new Lazy(canDeflationSacrifice, false),
  upgradeEffectValue: {
    overflow: Array(OVERFLOW_UPGRADE_COUNT).fill(0).map((v, i)=>new Lazy(upgradeConstObj.overflow[i].effectValueFunction, Decimal.dOne))
  },
  autobuyerInterval: {
    matter: Array(autobuyerConstObj.matter.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval('matter',i), Decimal.dOne)),
    deflationPower: Array(autobuyerConstObj.deflationPower.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval('deflationPower',i), Decimal.dOne)),
    matterAutobuyer: Array(autobuyerConstObj.matterAutobuyer.length).fill(0).map((v, i)=> new Lazy(()=>getAutobuyerInterval('matterAutobuyer',i), Decimal.dOne)),
  }
};
