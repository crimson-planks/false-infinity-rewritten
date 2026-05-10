import { expect, test } from 'vitest'
import { floorSlog10_naive, floorSlog10 } from '../src/decimal'

test('floorSlog10', () => {
  expect(floorSlog10(1,1)).D_toBeEqualTolerance(0);
  expect(floorSlog10(-1,-1)).D_toBeEqualTolerance(0);
  expect(floorSlog10("-1e-100","-1e-100")).D_toBeEqualTolerance(0);
  expect(floorSlog10("1e-100","1e-100")).D_toBeEqualTolerance(0);
  expect(floorSlog10("1e-100","2e-100")).D_toBeEqualTolerance(-1);
  expect(floorSlog10("2e-100","1e-100")).D_toBeEqualTolerance(0);
  expect(floorSlog10(10,0)).D_toBeEqualTolerance(2);
  expect(floorSlog10(10,1)).D_toBeEqualTolerance(1);
  expect(floorSlog10(10,10)).D_toBeEqualTolerance(0);
  expect(floorSlog10(10,10.1)).D_toBeEqualTolerance(-1);
  expect(floorSlog10(0.1,-1)).D_toBeEqualTolerance(1);
  expect(floorSlog10(0.1,-0.99)).D_toBeEqualTolerance(0);
  expect(floorSlog10(0.1,-1.01)).D_toBeEqualTolerance(1);
  expect(floorSlog10(-1,0.1)).D_toBeEqualTolerance(-1);
  expect(floorSlog10(1e-5,-5)).D_toBeEqualTolerance(1);
  //new Decimal(-50).pow10() is slightly inaccurate, failing this test.
  expect(floorSlog10(1e-50,-50)).D_toBeEqualTolerance(1);
  expect(floorSlog10("1e-500","-500")).D_toBeEqualTolerance(1);

  expect(floorSlog10(-5,1e-5)).D_toBeEqualTolerance(-1);
  expect(floorSlog10(-50,1e-50)).D_toBeEqualTolerance(-1);
  expect(floorSlog10(-500,"1e-500")).D_toBeEqualTolerance(-1);

  expect(floorSlog10(1e308,308)).D_toBeEqualTolerance(1);
  expect(floorSlog10(1e50,50)).D_toBeEqualTolerance(1);
  expect(floorSlog10("eee40","9e39")).D_toBeEqualTolerance(2);
  expect(floorSlog10("eee40","1e40")).D_toBeEqualTolerance(2);
  expect(floorSlog10("eee40","1.5e40")).D_toBeEqualTolerance(1);
});