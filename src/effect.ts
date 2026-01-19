import type { Lazy } from "./cache";
import type Decimal from "./lib/break_eternity";

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