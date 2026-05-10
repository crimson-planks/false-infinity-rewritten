import Decimal, { type DecimalSource }  from 'break_eternity.js';
/**
 * Represents a sequence of numbers. (0-index) It provides functions for a value of an index, the sum of elements, and the inverse function of the sum.
 */
export abstract class CostScaling {
  abstract getCurrentCost(currentAmount: DecimalSource): Decimal
  /** How much does it cost when I buy buyAmount? */
  abstract getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: DecimalSource): Decimal
  /** How many can I buy with money? */
  abstract getAvailablePurchases(currentAmount: DecimalSource, money: DecimalSource): Decimal
  /** Can I buy buyAmount with money when currentAmount is bought? */
  canBuy(currentAmount: DecimalSource, buyAmount: DecimalSource, money: DecimalSource): boolean{
    return this.getTotalCostAfterPurchase(currentAmount, buyAmount).lte(money)
  }
}

/** costs that scales linearly. f(n) = b + an
 * @param baseCost
 * @param baseIncrease
 */
export class LinearCostScaling extends CostScaling{
  baseCost: Decimal;
  baseIncrease: Decimal;
  constructor(param: { baseCost: DecimalSource; baseIncrease: DecimalSource }) {
    super();
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
  getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: DecimalSource): Decimal {
    currentAmount = new Decimal(currentAmount);
    buyAmount = new Decimal(buyAmount);
    if(buyAmount.eq(1)) return this.getCurrentCost(currentAmount);
    return buyAmount
      .mul(
        this.getCurrentCost(currentAmount)
          .mul(2)
          .add(this.baseIncrease.mul(buyAmount.sub(1)))
      )
      .div(2);
  }
  /** How many can I buy with money? (floored) */
  getAvailablePurchases(currentAmount: DecimalSource, money: DecimalSource): Decimal {
    currentAmount = new Decimal(currentAmount);
    money = new Decimal(money);
    if(this.baseIncrease.eq(0)) return money.div(this.baseCost);
    const currentCost = this.getCurrentCost(currentAmount);
    if(this.baseIncrease.lt(0)&&currentCost.lt(0)) return new Decimal(Decimal.dInf);
    const a = this.baseIncrease.div(2);
    const b = currentCost.mul(2).sub(this.baseIncrease).div(2);
    const c = money.neg();
    const det = b.sqr().sub(a.mul(c).mul(4));
    if(det.lt(0)) return new Decimal(Decimal.dInf);
    return b
      .neg()
      .add(det.sqrt())
      .div(a.mul(2)).floor();
  }
}
export class ExponentialCostScaling extends CostScaling{
  baseCost: Decimal;
  baseIncrease: Decimal;
  constructor( param: { baseCost: DecimalSource; baseIncrease: DecimalSource } ) {
    super();
    this.baseCost = new Decimal(param.baseCost);
    this.baseIncrease = new Decimal(param.baseIncrease);
  }
  getCurrentCost(currentAmount: DecimalSource){
    return this.baseCost.mul(this.baseIncrease.pow(currentAmount));
  }
  getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: DecimalSource): Decimal {
    return this.getCurrentCost(currentAmount)
      .mul(this.baseIncrease.pow(buyAmount).sub(1))
      .div(this.baseIncrease.sub(1));
  }
  getAvailablePurchases(currentAmount: DecimalSource, money: DecimalSource): Decimal {
    money = new Decimal(money);
    return money.mul(this.baseIncrease.sub(1)).div(this.getCurrentCost(currentAmount)).add(1).log(this.baseIncrease).floor();
  }
}
/** Costs that stay constant after any purchase. */
export class ConstantCostScaling extends CostScaling{
  baseCost: Decimal;
  constructor(baseCost: DecimalSource){
    super();
    this.baseCost = new Decimal(baseCost);
  }
  getCurrentCost(currentAmount: DecimalSource): Decimal {
    return this.baseCost;
  }
  getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: DecimalSource): Decimal {
    return this.baseCost.mul(buyAmount);
  }
  getAvailablePurchases(currentAmount: DecimalSource, money: DecimalSource): Decimal {
    return Decimal.div(money, this.baseCost);
  }
}
/**
 * @param sumFunction the sum of all elements between(inclusive) 0th and (n-1)th. Alternatively, the cost when buying n items when 0 is bought. It must be a strictly increasing function, and sumFunction(0) must equal 0. (x < y => f(x) < f(y))
 * @param inverseSumFunction If provided, this function will be used instead for the inverse function of sumFunction. If not provided, it will use {@link Decimal.increasingInverse}.
 */
export class SumFunctionCostScaling extends CostScaling{
  sumFunction: (currentAmount: Decimal) => Decimal;
  inverseSumFunction: (money: DecimalSource) => Decimal;
  constructor(sumFunction: (currentAmount: Decimal) => Decimal, inverseSumFunction?: (money: DecimalSource) => Decimal){
    super();
    this.sumFunction = sumFunction;
    this.inverseSumFunction = inverseSumFunction ?? Decimal.increasingInverse(this.sumFunction);
  }
  getCurrentCost(currentAmount: DecimalSource): Decimal {
    currentAmount = new Decimal(currentAmount);
    return this.sumFunction(currentAmount.add(1)).sub(this.sumFunction(currentAmount));
  }
  getTotalCostAfterPurchase(currentAmount: DecimalSource, buyAmount: DecimalSource): Decimal {
    currentAmount = new Decimal(currentAmount);
    return this.sumFunction(currentAmount.add(buyAmount)).sub(this.sumFunction(currentAmount));
  }
  getAvailablePurchases(currentAmount: DecimalSource, money: DecimalSource): Decimal {
    currentAmount = new Decimal(currentAmount);
    const c = this.sumFunction(currentAmount);
    return this.inverseSumFunction(c.add(money)).sub(currentAmount).floor();
  }
}