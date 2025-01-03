import type Decimal from './lib/break_eternity';
/** costs that scales linearly. f(n) = b + an
 */
export class LinearCostScaling {
  baseCost: Decimal;
  baseIncrease: Decimal;
  constructor(param: { baseCost: Decimal; baseIncrease: Decimal }) {
    this.baseCost = param.baseCost;
    this.baseIncrease = param.baseIncrease;
  }
  getCurrentCost(currentAmount: Decimal): Decimal {
    return this.baseCost.add(this.baseIncrease.mul(currentAmount));
  }
  /** How much does it cost when I buy buyAmount?*/
  getTotalCostAfterPurchase(currentAmount: Decimal, buyAmount: Decimal): Decimal {
    return buyAmount
      .mul(
        this.getCurrentCost(currentAmount)
          .mul(2)
          .add(this.baseIncrease.mul(buyAmount.sub(1)))
      )
      .div(2);
  }
  /** How many can I buy with money? (not rounded) */
  GetAvailablePurchases(currentAmount: Decimal, money: Decimal): Decimal {
    const a = this.baseIncrease;
    const b = currentAmount.mul(2).sub(this.baseIncrease);
    const c = money.mul(-2);
    return b
      .neg()
      .add(b.sqr().add(a.mul(c).mul(4)))
      .div(a.mul(2));
  }
}
/** for cost scaling fast enough such that f(n+1)/f(n)>MAX_SAFE_INTEGER for all n>=0*/
