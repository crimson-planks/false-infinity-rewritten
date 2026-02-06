import type { Lazy } from "./cache";
import type Decimal from 'break_eternity.js';

export class Effect{
  value: Lazy<Decimal>
  canBeApplied: boolean
  constructor(value: Lazy<Decimal>, canBeApplied: boolean) {
    this.value = value;
    this.canBeApplied = canBeApplied;
  }
  get effectValue(){
    this.value.invalidate();
    return this.value.cachedValue;
  }
  applyEffect(f: (v: Decimal)=>any){
    if(this.canBeApplied) f(this.effectValue);
  }
}