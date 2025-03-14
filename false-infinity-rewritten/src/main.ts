import './assets/main.css';

import { createApp } from 'vue';

import Decimal from './lib/break_eternity';
import App from './App.vue';
import { AutobuyerKind, AutobuyerTick, getAutobuyerCostScaling } from './autobuyer';
import { player } from './player';
import { updateScreen,ui } from './ui';
import { gameCache } from './cache';
import { load, save, toStringifiableObject, toUsableObject, mergeObj_nocopy, fixSave } from './saveload';
import { game_devTools } from './devtools';
declare global{
  interface Window{
    Decimal?: typeof Decimal
    player?: typeof player
    getAutobuyerCostScaling?: typeof getAutobuyerCostScaling
    ui?: typeof ui
    toStringifiableObject?: typeof toStringifiableObject
    toUsableObject?: typeof toUsableObject
    save?: typeof save
    load?: typeof load
    mergeObj_nocopy?: typeof mergeObj_nocopy
    game_devTools?: typeof game_devTools
  }
}
window.Decimal = Decimal;
window.player = player;
window.getAutobuyerCostScaling = getAutobuyerCostScaling;
window.ui = ui;
window.toStringifiableObject = toStringifiableObject;
window.toUsableObject = toUsableObject;
window.save = save;
window.load = load;
window.mergeObj_nocopy = mergeObj_nocopy;
window.game_devTools = game_devTools;

const app = createApp(App);
app.mount('#app');
load();
fixSave();
let autosaveTimer=0;
setInterval(function(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = new Decimal(player.currentTime-previousTime).div(1000);
  autosaveTimer=autosaveTimer+diff.toNumber();
  if(autosaveTimer>=10){
    save();
    autosaveTimer=0;
    console.log("game saved!")
  }
  gameCache.translatedDeflationPower.invalidate();
  //@ts-ignore
  Object.keys(player.autobuyers).forEach((key: AutobuyerKind)=>{
    for(let i=0;i<player.autobuyers[key].length;i++){
      AutobuyerTick(key, i, diff);
    }
  });
  updateScreen();
}, 50);