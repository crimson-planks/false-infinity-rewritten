import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js'
import App from './App.vue';
import { AutobuyerKind, AutobuyerTick, BuyInterval, getAutobuyerCostScaling, getIntervalCostScaling } from './autobuyer';
import { getDefaultPlayer, player, setPlayer } from './player';
import { updateScreen, ui } from './ui';
import { gameCache } from './cache';
import { load, save, toStringifiableObject, toUsableObject, mergeObj_nocopy, fixSave } from './saveload';
import { game_devTools } from './devtools';
import { overflow, OVERFLOW } from './prestige';
import Autobuyer from './components/Autobuyer.vue';
import { CurrencyKind, getCurrency } from './currency';

export const VERSION = "0.1.0"

declare global{
  interface Window{
    Decimal?: typeof Decimal
    player?: typeof player
    getAutobuyerCostScaling?: typeof getAutobuyerCostScaling
    getIntervalCostScaling?: typeof getIntervalCostScaling
    ui?: typeof ui
    toStringifiableObject?: typeof toStringifiableObject
    toUsableObject?: typeof toUsableObject
    save?: typeof save
    load?: typeof load
    getDefaultPlayer?: typeof getDefaultPlayer
    setPlayer?: typeof setPlayer
    mergeObj_nocopy?: typeof mergeObj_nocopy
    game_devTools?: typeof game_devTools
  }
}
window.Decimal = Decimal;
window.player = player;
window.getAutobuyerCostScaling = getAutobuyerCostScaling;
window.getIntervalCostScaling = getIntervalCostScaling;
window.ui = ui;
window.toStringifiableObject = toStringifiableObject;
window.toUsableObject = toUsableObject;
window.save = save;
window.load = load;
window.getDefaultPlayer = getDefaultPlayer;
window.setPlayer = setPlayer;
window.mergeObj_nocopy = mergeObj_nocopy;
window.game_devTools = game_devTools;

const app = createApp(App);
app.mount('#app');
load();
fixSave();
let autosaveTimer=0;
export function getPlayTime(){
  return player.currentTime-player.createdTime
};
export function getMatterPerSecond(){
  let result = player.autobuyers.matter[0].amount.mul(player.autobuyers.matter[0].interval.recip()).mul(+player.autobuyers.matter[0].toggle)
  result = result.minus(getAutobuyerCostScaling(AutobuyerKind.Matter, 0).getTotalCostAfterPurchase(player.autobuyers.matter[0].amount,player.autobuyers.matter[1].amount.mul(player.autobuyers.matter[1].interval.recip())).mul(+player.autobuyers.matter[1].toggle))
  return result
}
setInterval(function(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = new Decimal(player.currentTime-previousTime).div(1000);
  autosaveTimer=autosaveTimer+diff.toNumber();
  if(autosaveTimer>=10){
    save();
    autosaveTimer=0;
    console.log("game saved!");
  }
  //@ts-ignore
  Object.keys(player.autobuyers).forEach((key: AutobuyerKind)=>{
    if(key==AutobuyerKind.Matter && player.isOverflowing) return;
    for(let i=0;i<player.autobuyers[key].length;i++){
      AutobuyerTick(key, i, diff);
    }
  });

  gameCache.upgradeEffectValue.overflow.forEach((v, i)=>{
    v.invalidate()
  })
  gameCache.deflatorGainOnDeflation.invalidate();
  gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.invalidate();
  gameCache.translatedDeflationPowerMultiplierWhenSacrifice.invalidate();
  gameCache.translatedDeflationPower.invalidate();
  gameCache.canDeflationSacrifice.invalidate();
  if(player.matter.gt(OVERFLOW) && !player.isOverflowing){
    player.isOverflowing = true;
    player.matter=OVERFLOW;
  }
  if(player.fusion.matterPoured.gte("1e10") && !player.fusion.unlocked){
    player.fusion.unlocked = true;
  }
  updateScreen();
}, 50);

addEventListener("keypress",(ev)=>{
  if(ev.code==="KeyM"){
    for(let i=0;i<player.autobuyers.matter.length;i++){
      BuyInterval(AutobuyerKind.Matter, i,
        getIntervalCostScaling(AutobuyerKind.Matter, i).getAvailablePurchases(
        player.autobuyers.matter[i].intervalAmount, getCurrency(CurrencyKind.Matter)).max(0).floor()
      );
    }
  }
});