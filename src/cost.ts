import Decimal, { type DecimalSource }  from 'break_eternity.js';
abstract class CostScaling {
  abstract getCurrentCost(currentAmount: DecimalSource): Decimal
  /** How much does it cost when I buy buyAmount?*/
  abstract getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: Decimal): Decimal
  /** How many can I buy with money? */
  abstract getAvailablePurchases(currentAmount: DecimalSource, money: Decimal): Decimal
}
/** costs that scales linearly. f(n) = b + an
 */
export class LinearCostScaling {
  baseCost: Decimal;
  baseIncrease: Decimal;
  constructor(param: { baseCost: DecimalSource; baseIncrease: DecimalSource }) {
    this.baseCost = new Decimal(param.baseCost);
    this.baseIncrease = new Decimal(param.baseIncrease);
  }
  toObject(){
    return {baseCost: this.baseCost, baseIncrease: this.baseIncrease}
  }
  getCurrentCost(currentAmount: DecimalSource): Decimal {
    return this.baseCost.add(this.baseIncrease.mul(currentAmount));
  }
  /** How much does it cost when I buy buyAmount?*/
  getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: Decimal): Decimal {
    if(buyAmount.eq(1)) return this.getCurrentCost(currentAmount);
    return buyAmount
      .mul(
        this.getCurrentCost(currentAmount)
          .mul(2)
          .add(this.baseIncrease.mul(buyAmount.sub(1)))
      )
      .div(2);
  }
  /** How many can I buy with money? (not rounded) */
  getAvailablePurchases(currentAmount: DecimalSource, money: Decimal): Decimal {
    if(this.baseIncrease.eq(0)) return money.div(this.baseCost);
    const currentCost = this.getCurrentCost(currentAmount);
    if(this.baseIncrease.lt(0)&&currentCost.lt(0)) return Decimal.dInf;
    const a = this.baseIncrease.div(2);
    const b = currentCost.mul(2).sub(this.baseIncrease).div(2);
    const c = money.neg();
    const det = b.sqr().sub(a.mul(c).mul(4));
    if(det.lt(0)) return Decimal.dInf;
    return b
      .neg()
      .add(det.sqrt())
      .div(a.mul(2));
  }
}
export class ExponentialCostScaling {
  baseCost: Decimal;
  baseIncrease: Decimal;
  constructor( param: { baseCost: Decimal; baseIncrease: Decimal } ) {
    this.baseCost = param.baseCost;
    this.baseIncrease = param.baseIncrease;
  }
  getCurrentCost(currentAmount: Decimal){
    return this.baseCost.mul(this.baseIncrease.pow(currentAmount));
  }
  getTotalCostAfterPurchase(currentAmount: Decimal, buyAmount: Decimal): Decimal {
    return this.getCurrentCost(currentAmount)
      .mul(this.baseIncrease.pow(buyAmount).sub(1))
      .div(this.baseIncrease.sub(1));
  }
  getAvailablePurchases(currentAmount: Decimal, money: Decimal): Decimal {
    return money.mul(this.baseIncrease.add(1)).div(this.getCurrentCost(currentAmount)).add(1).log(this.baseIncrease);
  }
}
/** for cost scaling fast enough such that f(n+1)/f(n)>MAX_SAFE_INTEGER for all n>=0*/
export class CostScalingThatIsVeryFast {

}