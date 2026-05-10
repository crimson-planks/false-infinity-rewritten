import { expect } from 'vitest'
import Decimal from 'break_eternity.js';
import { isDecimalSource } from '../src/decimal'
function Decimal_ExpectDecimalSource(received: unknown, expected: unknown){
  if(!isDecimalSource(received)) {
    return {
      message: () => `expected received(${received}) to be DecimalSource`,
      pass: false,
    }
  }
  if(!isDecimalSource(expected)) {
    return {
      message: () => `expected expected(${expected}) to be DecimalSource`,
      pass: false,
    }
  }
  return undefined;
}
expect.extend({
  D_toBeEqualTolerance: (received, expected) => {
    const r = Decimal_ExpectDecimalSource(received, expected);
    if(r!=undefined) return r;
    if(!Decimal.eq_tolerance(received, expected, 1e-9)){
      return {
        message: () => `expected ${expected}, recieved ${received}`,
        pass: false,
      }
    }
    return {
      message: () => 'toBeEqualTolerance passed',
      pass: true
    }
  },
});