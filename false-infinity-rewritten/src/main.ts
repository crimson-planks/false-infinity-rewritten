import './assets/main.css';

import { createApp } from 'vue';

import Decimal from './lib/break_eternity';
import App from './App.vue';
import { AutobuyerKind, AutobuyerTick, getAutobuyerCostScaling } from './autobuyer';
import { player, type Player } from './player';
import { updateScreen,ui } from './ui';
import { gameCache } from './cache';
declare global{
  interface Window{
    Decimal: typeof Decimal
    player: typeof player
    getAutobuyerCostScaling: typeof getAutobuyerCostScaling
    ui: typeof ui
  }
}
window.Decimal = Decimal;
window.player = player;
window.getAutobuyerCostScaling = getAutobuyerCostScaling;
window.ui = ui;

const app = createApp(App);
app.mount('#app');
setInterval(function(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = new Decimal(player.currentTime-previousTime).div(1000);
  gameCache.translatedDeflationPower.invalidate();
  for(let i=0;i<player.autobuyers.matter.length;i++){
    AutobuyerTick(AutobuyerKind.Matter, i, diff);
  }
  updateScreen();
}, 50);