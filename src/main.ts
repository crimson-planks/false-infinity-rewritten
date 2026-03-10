/** @prettier */
import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js';
import App from './App.vue';
import {
  AutobuyerKindArr,
  AutobuyerKindObj,
  AutobuyerTick, ClickMaxMatterAutobuyerInterval
} from './autobuyer';
import { player } from './player';
import { updateScreen, initInput, input, updateScreenInit } from './ui';
import { gameCache } from './cache';
import {
  load,
  save,
  fixSave
} from './saveload';
import { getOverflowLimit, OVERFLOW } from './prestige';
import { convertMatter, fusionUnlockRequiredMatter, get_matterDecay_dueTo_fusion } from './fusion';
import { loadToWindow } from './shims';

const app = createApp(App);
load();
fixSave();
initInput();
let autosaveTimer = 0;
//TODO: fix player.
function offlineProgressCheck(){
  const diff = Date.now() - player.currentTime;
  if(diff>10000) console.log(diff+" milliseconds");
}
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
    if (player.isOverflowing && (ak == AutobuyerKindObj.Matter || ak === AutobuyerKindObj.DeflationPower)) continue;
    player.autobuyers[ak].forEach((v, i)=>{
      if(player.isOverflowing && (ak == AutobuyerKindObj.MatterAutobuyer && (i==0 || i==1 || i==2 || i==3))) return;
      AutobuyerTick({kind: ak, ord: i}, diffDecimal);
    })
  }
  if(player.fusion.isFusing){
    player.matter = player.matter.mul(get_matterDecay_dueTo_fusion(player.matter).pow(diffDecimal));
    player.fusion.helium = player.fusion.helium.add(player.matter.div(2_147_483_648).pow(1/16).mul(player.fusion.allocatedStar.pow_base(1.2)).mul(diffDecimal));
  }

  //the order is very important.
  gameCache.hasDeflated.invalidate();
  gameCache.hasOverflowed.invalidate();
  gameCache.matterAutobuyerCostScalingReductionByDeflation.invalidate();
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
  if (player.matter.gt(getOverflowLimit()) && !player.isOverflowing) {
    player.isOverflowing = true;
    //player.matter = getOverflowLimit();
  }
  if (player.fusion.matterPoured.gte(fusionUnlockRequiredMatter) && !player.fusion.unlocked) {
    player.fusion.unlocked = true;
  }
  updateScreen();
}
updateScreenInit();
setInterval(main, 50);

app.mount('#app');


addEventListener('keydown', (ev) => {
  if (ev.code === 'KeyM') {
    ClickMaxMatterAutobuyerInterval();
  }
});
loadToWindow();
