/** @prettier */
import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js';
import App from './App.vue';
import {
  AutobuyerKindArr,
  AutobuyerKindObj,
  AutobuyerTick,
  BuyInterval,
  ClickMaxMatterAutobuyerInterval,
  getAutobuyerCostScaling, getIntervalCostScaling
} from './autobuyer';
import { player } from './player';
import { updateScreen, initInput, ui, input } from './ui';
import { gameCache } from './cache';
import {
  load,
  save,
  fixSave
} from './saveload';
import { game_devTools } from './devtools';
import { OVERFLOW } from './prestige';
import { CurrencyKindObj, getCurrency } from './currency';
import { fusionUnlockRequiredMatter } from './fusion';

declare global {
  interface Window {
    Decimal?: typeof Decimal;
    player?: typeof player;
    ui?: any;
    game_devTools?: typeof game_devTools;
  }
}
function loadToWindow() {
  window.Decimal = Decimal;
  window.player = player;
  window.ui = ui;
  window.game_devTools = game_devTools;
}

const app = createApp(App);
load();
fixSave();
initInput();
let autosaveTimer = 0;

function main(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = (player.currentTime - previousTime) / 1000;
  const diffDecimal = new Decimal(diff);
  autosaveTimer = autosaveTimer + diff;
  if (autosaveTimer >= 10) {
    save();
    autosaveTimer = 0;
    console.log('game saved!');
  }
  if(input.value.maxAutobuyerIntervalHeld){
    ClickMaxMatterAutobuyerInterval();
  }
  for(let ak of AutobuyerKindArr){
    if (ak == AutobuyerKindObj.Matter && player.isOverflowing) break;
    player.autobuyers[ak].forEach((v, i)=>{AutobuyerTick({kind: ak, ord: i}, diffDecimal);})
  }

  //the order is very important.
  gameCache.upgradeEffectValue.overflow.forEach((v, i) => {
    v.invalidate();
  });
  gameCache.deflatorGainOnDeflation.invalidate();
  gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.invalidate();
  gameCache.translatedDeflationPowerMultiplierWhenSacrifice.invalidate();
  gameCache.translatedDeflationPower.invalidate();
  gameCache.canDeflationSacrifice.invalidate();
  for(let ak of AutobuyerKindArr){
    gameCache.autobuyerInterval[ak].forEach((v)=>{
      v.invalidate();
    })
  }
  if (player.matter.gte(OVERFLOW) && !player.isOverflowing) {
    player.isOverflowing = true;
    player.matter = OVERFLOW;
  }
  if (player.fusion.matterPoured.gte(fusionUnlockRequiredMatter) && !player.fusion.unlocked) {
    player.fusion.unlocked = true;
  }
  updateScreen();
}
setInterval(main, 50);

app.mount('#app');


addEventListener('keydown', (ev) => {
  if (ev.code === 'KeyM') {
    ClickMaxMatterAutobuyerInterval();
  }
});
loadToWindow();
