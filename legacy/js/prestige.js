function getPotentialDeflatorsOnDeflation(amount){
    return linearCost.GetTotalCost(linearCost.GetIncreasedCost(new Decimal(1),new Decimal(1),game.deflation), new Decimal(1),amount);
}
function getDeflationCost(amount){
    return exponentialCost.GetIncreasedCost(new Decimal(1000),new Decimal(10),Decimal.sub(game.deflation.add(amount),1));
}
function canDeflate(amount){
    return getDeflationCost(amount).lte(game.bestMatter.deflation);
}
function deflate(amount){
    if(!canDeflate(amount)) return;
    game.matter = new Decimal();
    game.bestMatter.deflation = new Decimal();

    game.autobuyers.matter = getDefaultGame().autobuyers.matter;

    game.deflator = game.deflator.add(getPotentialDeflatorsOnDeflation(amount));
    game.deflation=game.deflation.add(1);
    game.deflationPower = new Decimal();
    appThis.UpdateScreen();
}
function getPotentialDeflatorsOnDeflationSacrifice(dfp){
    return dfp.pow(1/3).div(2).floor();
}
function getRequiredDeflationPowerOnDeflationSacrifice(){
    return getPotentialDeflatorsOnDeflationSacrifice(game.sacrificedDeflationPower).add(1).mul(2).pow(3);
}
function deflationSacrifice(){
    const deflationGetAmount = getPotentialDeflatorsOnDeflationSacrifice(game.deflationPower)
    .sub(getPotentialDeflatorsOnDeflationSacrifice(game.sacrificedDeflationPower));
    if(deflationGetAmount.lt(1)) return;
    game.deflator = game.deflator.add(deflationGetAmount);
    game.sacrificedDeflationPower = game.deflationPower;
    game.deflationPower=new Decimal();
}
function overflow(){
    const df = getDefaultGame();
    game.matter = new Decimal();
    game.bestMatter.deflation = new Decimal();
    game.bestMatter.overflow = new Decimal();
    game.isOverflow = false;

    game.autobuyers.matter = df.autobuyers.matter;
    game.autobuyers.deflation = df.autobuyers.deflation;

    game.deflation = new Decimal();
    game.deflator = new Decimal();
    game.deflationPower = new Decimal();
    game.sacrificedDeflationPower = new Decimal();

    game.overflowPoint = game.overflowPoint.add(1);
    appThis.UpdateScreen();
}