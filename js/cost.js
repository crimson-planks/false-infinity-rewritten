const autobuyerDefaultCostList = {
    matter: [new Decimal(10),new Decimal(500)],
    deflation: [new Decimal(1)]
}
const autobuyerDefaultCostIncreaseList = {
    matter: [new Decimal(5), new Decimal(100)],
    deflation: [new Decimal(0)]
}
const autobuyerDefaultIntervalCostList = {
    matter: [new Decimal(100),new Decimal(1000)],
    deflation: [new Decimal(1)]
}
const autobuyerDefaultIntervalCostIncreaseList = {
    matter: [new Decimal(10), new Decimal(100)],
    deflation: [new Decimal(2)]
}
const autobuyerCurrencyList = {
    matter: ["matter","matter","matter"],
    deflation: ["deflator"]
}
function getCurrency(currencyType){
    //console.log("get: "+currencyType);
    switch(currencyType){
        case "matter":
            return game.matter;
        case "deflator":
            return game.deflator;
    }
}
function setCurrency(currencyType, v){
    switch(currencyType){
        case "matter":
            game.matter = v;
            return;
        case "deflator":
            game.deflator = v;
            return;
    }
}
function getAutobuyerCostIncrease(type, ord){
    let rslt = autobuyerDefaultCostIncreaseList[type][ord];
    if(type==="matter") rslt = rslt.sub(Decimal.min(4,game.deflation));
    return rslt;
}
function getAutobuyerCost(type, ord){
    let rslt=linearCost.GetIncreasedCost(autobuyerDefaultCostList[type][ord],
        getAutobuyerCostIncrease(type, ord),
        game.autobuyers[type][ord].amount
    );
    if(type==="matter") rslt=rslt.sub(GetTranslatedDeflationPower());
    return rslt;
}
function getTotalAutobuyerCost(type, ord, amount){
    return linearCost.GetTotalCost(getAutobuyerCost(type, ord),getAutobuyerCostIncrease(type, ord),amount);
}
function getAutobuyerIntervalCost(type, ord){
    return exponentialCost.GetIncreasedCost(autobuyerDefaultIntervalCostList[type][ord],
        autobuyerDefaultIntervalCostIncreaseList[type][ord],
        game.autobuyers[type][ord].intervalAmount
    );
}
function getTotalAutobuyerIntervalCost(type, ord, amount){
    return exponentialCost.GetTotalCost(getAutobuyerIntervalCost(type, ord),autobuyerDefaultIntervalCostIncreaseList[type][ord],amount)
}
function canBuyAutobuyer(type,ord,buyAmount){
    return getTotalAutobuyerCost(type,ord,buyAmount).lte(getCurrency(autobuyerCurrencyList[type][ord]))
}
function buyAutobuyer(type, ord, buyAmount){
    if(!canBuyAutobuyer(type,ord,buyAmount)) return;
    setCurrency(autobuyerCurrencyList[type][ord],
        getCurrency(autobuyerCurrencyList[type][ord]).sub(getTotalAutobuyerCost(type,ord,buyAmount)));
    game.autobuyers[type][ord].amount = game.autobuyers[type][ord].amount.add(buyAmount);
}
function canBuyInterval(type,ord,buyAmount){
    return getTotalAutobuyerIntervalCost(type,ord,buyAmount).lte(getCurrency(autobuyerCurrencyList[type][ord]))
}
function buyInterval(type, ord, buyAmount){
    if(!canBuyInterval(type,ord,buyAmount)) return;
    setCurrency(autobuyerCurrencyList[type][ord],
        getCurrency(autobuyerCurrencyList[type][ord]).sub(getTotalAutobuyerIntervalCost(type,ord,buyAmount)));
    game.autobuyers[type][ord].intervalAmount = game.autobuyers[type][ord].intervalAmount.add(buyAmount);
}