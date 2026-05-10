import Decimal, { type DecimalSource } from 'break_eternity.js';
/*export const d0 = new Decimal(Decimal.dZero);
export const d1 = new Decimal(Decimal.dOne);*/

export function isDecimalSource(value: unknown): value is DecimalSource{
  return typeof value=='string' || typeof value=='number' || value instanceof Decimal;
}
//pow10, but with more accuracy.
export function pow10_accurate(value: DecimalSource){
  value = new Decimal(value);
  if(value.layer == 0 && value.mag<15.954242509439325){ //log10(9e15)
    return Decimal.fromComponents(1, 0, Math.pow(10,value.sign * value.mag));
  }
  else if(value.layer == 0){
    return Decimal.fromComponents(1, 1, value.sign * value.mag);
  }
  return value.pow10();
};

/**
 * The naive implementation of floorSlog10, for unit tests.
 */
export function floorSlog10_naive(value: DecimalSource, payload: DecimalSource){
  //https://andydude.github.io/tetration/archives/tetration2/ident.html
  return new Decimal(value).slog(10).sub(new Decimal(payload).slog(10)).floor();
}
/**
 * If value = Decimal.tetrate(10,height,payload), this function finds floor(height) if value and payload is given.
 * equivalent to floor(slog10(value) - slog10(payload))
 * **NOTE: (value < 1) or (payload < 1) is currently not implemented.**
*/
export function floorSlog10(value: DecimalSource, payload: DecimalSource) {

  let valueD = new Decimal(value);
  let payloadD = new Decimal(payload);
  /*
  10^x is the same as adding 1 to x.layer (if mag > 0)
  log_10(x) is the same as subtracting 1 to x.layer (if mag > 0 && layer >= 1)
  https://andydude.github.io/tetration/archives/tetration2/ident.html
  slog10(10^x) = 1 + slog10(x)
  */
  //if 0 < x < 1: pow(10,x) causes precision errors
  //if x < 0: 0 < 10^x < 1
  //handle special cases
  /*
  0<=x<1: -1<=slog_10(x)<0
  x<0: -2<slog_10(x)<1
  */
  //value<0,0<=value<1,payload<0,0<=payload<1
  if(valueD.lt(0)){
    if(payloadD.lt(0)){
      if(valueD.gte(payloadD)) return 0;
      return -1;
    }
    else if(payloadD.gte(0)&&payloadD.lt(1)){
      if(pow10_accurate(valueD).gte(payloadD)) return -1;
      return -2;
    }
  }
  else if (valueD.gte(0)&&valueD.lt(1)){
    if(payloadD.lt(0)){
      if(valueD.gte(pow10_accurate(payloadD))) return 1;
      return 0;
    }
    else if(payloadD.gte(0)&&payloadD.lt(1)){
      if(valueD.gte(payloadD)) return 0;
      return -1;
    }
  }
  //console.log(`value: ${valueD}, payload: ${payloadD}`);
  //the remaining cases are either when one of the values is <1 and the other is >=1, or when both are >=1.
  //when only one of them is <1, it's safe to pow10 or log10.
  let layerChange = 0;
  if (valueD.lt(1)){
    layerChange--;
    valueD = pow10_accurate(valueD);
  }
  if(payloadD.lt(1)){
    layerChange++;
    payloadD = pow10_accurate(payloadD);
  }
  //console.log(`value: ${valueD}, payload: ${payloadD}`);
  if (payloadD.lt(1)) throw RangeError("payload < 1 is not implemented");
  if (valueD.lt(1)) throw RangeError("value < 1 is not implemented");

  //When payload>=1 && value>=1
  //
  //1 <= mag < 9e15
  /*
  The naive (and slow) way to do this would be floor(slog10(valueD.mag) - slog10(payloadD.mag)), but we can do better.
  the result value can be -3, -2, -1, 0, 1, 2
  The problem is finding where valueD.mag fits in the hierarchy below.
  -3                          -2                    -1              0                 1                    2
    log10(log10(payloadD.mag)) < log10(payloadD.mag) < payloadD.mag < 10^payloadD.mag < 10^10^payloadD.mag
  There are 5 cases. (This can be further optimized by checking if payloadD.mag < valueD.mag)

  If( log10(log10(payloadD.mag)) <= valueD.mag < log10(payloadD.mag) ): result = -2
  If( log10(payloadD.mag) <= valueD.mag < payloadD.mag ): result = -1
  If( payloadD.mag <= valueD.mag < 10^payloadD.mag ): result = 0
  if( 10^payloadD.mag <= valueD.mag < 10^10^payloadD.mag ): result = 1
  if( 10^10^payloadD.mag <= valueD.mag ): result = 2
  note: this works because Math.log10(0) == -Infinity
   */
  let coreLayerDiff = 0;
  //result = -3 or -2 or -1
  const vm = valueD.mag;
  const pm = payloadD.mag;
  console.log(`vm: ${vm}, pm: ${pm}`)
  if (vm < pm) {
    //TODO: figure out if log is faster than pow
    //result: they're equally as fast, so we can use them interchangebly
    //pow and log have different domains and ranges, so use pow when the numbers <= 0 and use log when numbers > log10(1.79e308)
    if (vm < Math.log10(Math.log10(pm))) coreLayerDiff = -3;
    else if (vm < Math.log10(pm)) coreLayerDiff = -2;
    else coreLayerDiff = -1;
  }
  //result = 0 or 1 or 2
  else {
    if (vm < Math.pow(10, pm)) coreLayerDiff = 0;
    else if (vm < Math.pow(10, Math.pow(10, pm))) coreLayerDiff = 1;
    else coreLayerDiff = 2;
  }
  console.log(`coreLayerDiff: ${coreLayerDiff}`)

  return valueD.layer - payloadD.layer + layerChange + coreLayerDiff;
}
export function viewNumber(x: number): [number, number]{
  const buffer = new ArrayBuffer(8);
  const dataview = new DataView(buffer);
  dataview.setFloat64(0, x);
  let ui32_high = dataview.getUint32(0);
  let ui32_low = dataview.getUint32(4);
  return [ui32_high, ui32_low];
}
export function displayNumberAsBits(x: number){
  const [ui32_high, ui32_low] = viewNumber(x);
  return ui32_high.toString(2).padStart(32,'0')+ui32_low.toString(2).padStart(32,'0');
}
export function viewNumberToNumber(v: [number, number]): number{
  const buffer = new ArrayBuffer(8);
  const dataview = new DataView(buffer);
  dataview.setUint32(0, v[0]);
  dataview.setUint32(4, v[1]);
  return dataview.getFloat64(0);
}
export function nextNumber(x: number): number{
  //special case for -0
  if(Object.is(x,-0)) return 0;
  //there's no next number of Infinity
  if(x==Infinity) return Infinity;
  const buffer = new ArrayBuffer(8);
  const dataview = new DataView(buffer);
  dataview.setFloat64(0, x);
  let ui32_high = dataview.getUint32(0);
  let ui32_low = dataview.getUint32(4);
  if(ui32_high >= 2147483648) {
    ui32_low--;
    if(ui32_low == -1) {
      ui32_low = 4294967295;
      ui32_high--;
    }
  }
  else {
    ui32_low++;
    if(ui32_low == 4294967296){
      ui32_low = 0;
      ui32_high++;
    }
  }
  if(ui32_high == 4294967296) ui32_high = 0;
  else if(ui32_high == -1) ui32_high = 4294967295;
  console.log([ui32_high, ui32_low]);
  dataview.setUint32(0, ui32_high);
  dataview.setUint32(4, ui32_low);
  return dataview.getFloat64(0);
}