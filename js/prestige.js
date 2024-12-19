function getPotentialDeflatorsOnDeflation(amount){
    return exponentialCost.GetTotalCost(exponentialCost.GetIncreasedCost(new Decimal(1),new Decimal(3),game.deflation), new Decimal(3),amount);
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

    game.overflowPoint = game.overflowPoint.add(1);
    appThis.UpdateScreen();
}