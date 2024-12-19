const notations = {
    "default": new EternalNotations.DefaultNotation()
}
const messages = {
    shouldUpdateScreen: false
}

let game = getDefaultGame();



let appThis = undefined;
let isReady = false;

function GetActivateTimes_Autobuyer(autobuyer,time_ms){
    const resultTimer = Decimal.add(autobuyer.timer,time_ms);
    let q = resultTimer.div(autobuyer.interval).floor();
    autobuyer.timer = resultTimer.minus(q.mul(autobuyer.interval));
    return q;
}
const linearCost={
    GetBuyAmount(currentCost,costIncrease,currency){
        if(costIncrease.eq(0)) return Decimal.div(currency,currentCost);
        const b = Decimal.mul(currentCost,2).sub(costIncrease);
        return (b.neg().add(b.sqr().add(costIncrease.mul(currency).mul(8)).sqrt())).div(costIncrease.mul(2));
    },
    GetTotalCost(currentCost,costIncrease,amount){
        return Decimal.mul(currentCost,2).add(costIncrease.mul(Decimal.sub(amount,1))).mul(amount).div(2);
    },
    GetIncreasedCost(currentCost,costIncrease,amount){
        return currentCost.add(costIncrease.mul(amount));
    }
}
const exponentialCost={
    GetBuyAmount(currentCost,costIncrease,currency){
        return costIncrease.sub(1).mul(currency).div(currentCost).add(1).log(costIncrease);
    },
    GetTotalCost(currentCost,costIncrease,amount){
        return currentCost.mul(costIncrease.pow(amount).sub(1)).div(costIncrease.sub(1));
    },
    GetIncreasedCost(currentCost,costIncrease,amount){
        return currentCost.mul(costIncrease.pow(amount));
    }
}

function ToggleIsActive(type, ord){
    game.autobuyers[type][ord].isActive = !game.autobuyers[type][ord].isActive;
}
function init(){
    load();
    FillMissingValues(game);
}

function GetClickMatterGain(){
    return new Decimal(1);
}
function GetClickDeflationPowerGain(){
    return game.deflation;
}

function GetTranslatedDeflationPower(){
    return game.deflationPower.pow(0.5);
}
let translatedDeflationPower = GetTranslatedDeflationPower();

function GameLoop(){
    if(appThis===undefined) return;
    game.previousTime = game.currentTime;
    game.currentTime = Date.now();
    game.bestMatter.all = Decimal.max(game.bestMatter.all, game.matter);
    game.bestMatter.deflation = Decimal.max(game.bestMatter.deflation, game.matter);
    game.bestMatter.overflow = Decimal.max(game.bestMatter.overflow, game.matter);
    let matterPerSecond = new Decimal();
    translatedDeflationPower = GetTranslatedDeflationPower();
    if(!translatedDeflationPower.eq(0)) messages.shouldUpdateScreen=true;
    for(let type in game.autobuyers){
        for(let i = 0 ; i < game.autobuyers[type].length; i++){
            if(!game.autobuyers[type][i].amount.eq(0) && game.autobuyers[type][i].isActive && !game.isOverflow){
    
                let activationAmount = game.autobuyers[type][i].amount.mul(GetActivateTimes_Autobuyer(game.autobuyers[type][i],game.currentTime-game.previousTime));
                if(!activationAmount.eq(0)) messages.shouldUpdateScreen = true;
                if(type=="matter" && i==0) matterPerSecond = matterPerSecond.add(game.autobuyers.matter[i].interval.div(1000).mul(game.autobuyers.matter[i].amount));
                if(type=="matter" && i==0) game.matter = game.matter.add(GetClickMatterGain().mul(activationAmount));
                if(type=="deflation" && i==0) game.deflationPower = game.deflationPower.add(GetClickDeflationPowerGain().mul(activationAmount));
                if(i!=0) buyAutobuyer(type,i-1,Decimal.min(linearCost.GetBuyAmount(getAutobuyerCost(type,i-1),getAutobuyerCostIncrease(type, i-1),getCurrency(type)).floor(),activationAmount));
            }
            game.autobuyers[type][i].interval = defaultGame.autobuyers[type][i].interval.div(Decimal.pow(2,game.autobuyers[type][i].intervalAmount));
        }
    }
    if(game.bestMatter.overflow.gte(new Decimal(2).pow(31).sub(1))){
        game.isOverflow=true;
    }
    if(messages.shouldUpdateScreen){
        appThis.UpdateScreen();
        messages.shouldUpdateScreen=false;
    }
}
setInterval(GameLoop, 50);