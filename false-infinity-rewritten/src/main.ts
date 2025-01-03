import './assets/main.css';

import { createApp } from 'vue';

import Decimal from './lib/break_eternity';
import App from './App.vue';
import { AutobuyerKind, AutobuyerTick } from './autobuyer';
import { player } from './player';
import { updateScreen } from './ui';
window.player = player;

const app = createApp(App);
app.mount('#app');
setInterval(function(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = new Decimal(player.currentTime-previousTime).div(1000);
  AutobuyerTick(AutobuyerKind.Matter, 0, diff);
  updateScreen();
}, 50);