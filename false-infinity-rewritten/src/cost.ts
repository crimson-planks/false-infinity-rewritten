import { createBuilderStatusReporter } from 'typescript';
import Decimal from './lib/break_eternity';
/** costs that scales linearly. f(n) = b + an
 */
export class LinearCostScaling {
  baseCost: Decimal;
  increase: Decimal;
  constructor(param: { baseCost: Decimal; increase: Decimal }) {
    this.baseCost = param.baseCost;
    this.increase = param.increase;
  }
  toObject(){
    return {baseCost: this.baseCost, increase: this.increase}
  }
  getCurrentCost(currentAmount: Decimal): Decimal {
    return this.baseCost.add(this.increase.mul(currentAmount));
  }
  /** How much does it cost when I buy buyAmount?*/
  getTotalCostAfterPurchase(currentAmount: Decimal, buyAmount: Decimal): Decimal {
    if(buyAmount.eq(1)) return this.getCurrentCost(currentAmount);
    return buyAmount
      .mul(
        this.getCurrentCost(currentAmount)
          .mul(2)
          .add(this.increase.mul(buyAmount.sub(1)))
      )
      .div(2);
  }
  /** How many can I buy with money? (not rounded) */
  getAvailablePurchases(currentAmount: Decimal, money: Decimal): Decimal {
    if(this.increase.eq(0)) return money.div(this.baseCost);
    const currentCost = this.getCurrentCost(currentAmount);
    if(this.increase.lt(0)&&currentCost.lt(0)) return Decimal.dInf;
    const a = this.increase.div(2);
    const b = currentCost.mul(2).sub(this.increase).div(2);
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