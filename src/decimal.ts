import Decimal, { type DecimalSource } from 'break_eternity.js';

/**
 * If value = Decimal.tetrate(10,height,payload), this function finds floor(height) if value and payload is given.
 *
 * **NOTE: (value < 1) or (payload < 1) is currently not implemented.**
*/
export function floorSlog10(value: DecimalSource, payload: DecimalSource) {
  const valueD = new Decimal(value);
  const payloadD = new Decimal(payload);
  /*
  10^x is the same as adding 1 to x.layer (if mag > 0)
  log_10(x) is the same as subtracting 1 to x.layer (if mag > 0 && layer >= 1)
  slog10(10^x) = 1 + slog10(x)
  */
  if (payloadD.lt(1)) throw RangeError("payload < 1 is not implemented");
  if (valueD.lt(1)) throw RangeError("value < 1 is not implemented");


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
  note: this works because Math.log10(0) = -Infinity
   */
  let coreLayerDiff = 0;
  //result = -3 or -2 or -1
  const vm = valueD.mag;
  const pm = payloadD.mag;
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

  return valueD.layer - payloadD.layer + coreLayerDiff;
}
