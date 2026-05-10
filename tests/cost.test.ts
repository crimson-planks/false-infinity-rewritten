import { expect, test } from 'vitest'
import { LinearCostScaling } from '../src/cost'
test('LinearCostScaling', () => {
  const cs1 = new LinearCostScaling({baseCost: 1, baseIncrease: 1});
  expect(cs1.getCurrentCost(0)).D_toBeEqualTolerance(1);
  expect(cs1.getCurrentCost(1)).D_toBeEqualTolerance(2);
  expect(cs1.getCurrentCost(2)).D_toBeEqualTolerance(3);

  expect(cs1.canBuy(0,10,54)).toBe(false);
  expect(cs1.canBuy(0,10,54.95)).toBe(false);
  expect(cs1.canBuy(0,10,55)).toBe(true);
  expect(cs1.canBuy(5,10,104.95)).toBe(false);
  expect(cs1.canBuy(5,10,105)).toBe(true);

  expect(cs1.getAvailablePurchases(0,54)).D_toBeEqualTolerance(9);
  expect(cs1.getAvailablePurchases(0,54.95)).D_toBeEqualTolerance(9);
  expect(cs1.getAvailablePurchases(0,55)).D_toBeEqualTolerance(10);
  expect(cs1.getAvailablePurchases(0,66)).D_toBeEqualTolerance(11);

  expect(cs1.getTotalCostAfterPurchase(0,5)).D_toBeEqualTolerance(15);
  expect(cs1.getTotalCostAfterPurchase(0,8)).D_toBeEqualTolerance(36);
  expect(cs1.getTotalCostAfterPurchase(0,10)).D_toBeEqualTolerance(55);

  expect(cs1.getTotalCostAfterPurchase(0,1)).D_toBeEqualTolerance(1);
  expect(cs1.getTotalCostAfterPurchase(1,1)).D_toBeEqualTolerance(2);
  expect(cs1.getTotalCostAfterPurchase(2,1)).D_toBeEqualTolerance(3);
});
