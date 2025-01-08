import './assets/main.css';

import { createApp } from 'vue';

import Decimal from './lib/break_eternity';
import App from './App.vue';
import { autobuyerCostScaling, AutobuyerKind, AutobuyerTick } from './autobuyer';
import { player } from './player';
import { updateScreen } from './ui';
window.Decimal = Decimal;
window.player = player;
window.autobuyerCostScaling = autobuyerCostScaling;

const app = createApp(App);
app.mount('#app');
setInterval(function(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = new Decimal(player.currentTime-previousTime).div(1000);
  for(let i=0;i<player.autobuyers.matter.length;i++){
    AutobuyerTick(AutobuyerKind.Matter, i, diff);
  }
  updateScreen();
}, 50);