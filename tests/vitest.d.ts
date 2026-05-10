import { DecimalSource } from 'break_eternity.js'
import 'vitest'
interface CustomMatchers<T = any, R = void> {
    D_toBeEqualTolerance: (expected: DecimalSource) => R
  }
declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}