/** @prettier */
import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js';
import App from './App.vue';
import {
  AutobuyerKindArr,
  AutobuyerKindObj,
  AutobuyerTick, ClickMaxMatterAutobuyerInterval,
  overflowAutobuyerTick
} from './autobuyer';
import { player } from './player';
import { updateScreen, initInput, input, updateScreenInit } from './ui';
import { gameCache } from './cache';
import {
  load,
  save,
  fixSave
} from './saveload';
import { getOverflowLimit } from './prestige';
import { fusionUnlockRequiredMatter, get_matterDecay_dueTo_fusion, getHeliumPerSecond } from './fusion';
import { loadToWindow } from './shims';
import { UpgradeKindArr } from './upgrade';
import { getOc3InflationPowerMulPerSecond, updateUnlockedChallenge } from './challenge';
import { variables } from './constants';

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
function updateGame(diffDecimal: Decimal){
  for(let ak of AutobuyerKindArr){
    if (player.isOverflowing && (ak == AutobuyerKindObj.Matter || ak === AutobuyerKindObj.DeflationPower)) continue;
    player.autobuyers[ak].forEach((v, i)=>{
      AutobuyerTick({kind: ak, ord: i}, diffDecimal);
    })
  }
  overflowAutobuyerTick(diffDecimal.toNumber());
  if(player.fusion.isFusing && !player.isOverflowing){
    //console.log(`diffDecimal: ${diffDecimal.toFixed(4)}, matter change due to fusion: ${player.matter.mul(get_matterDecay_dueTo_fusion(player.matter).pow(diffDecimal).sub(1)).mul(20).toExponential(4)}`)
    player.matter = player.matter.mul(get_matterDecay_dueTo_fusion(player.matter).pow(diffDecimal));
    player.fusion.helium = player.fusion.helium.add(getHeliumPerSecond().mul(diffDecimal));
  }
  if(player.currentOverflowChallenge=='oc3'){
    if(player.challengeStuff.inflationPower.lt(getOverflowLimit())){
      player.challengeStuff.inflationPower = player.challengeStuff.inflationPower.mul(getOc3InflationPowerMulPerSecond().pow(diffDecimal))
    }
  }
  updateUnlockedChallenge();
  //the order is very important.
  gameCache.hasDeflated.invalidate();
  gameCache.hasOverflowed.invalidate();
  gameCache.matterAutobuyerCostScalingReductionByDeflation.invalidate();
  for(const uk of UpgradeKindArr){
      gameCache.upgradeEffectValue[uk].forEach((v, i) => {
        v.invalidate();
    });
  }
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

  gameCache.matterPerSecond.invalidate();
  if (player.matter.gt(getOverflowLimit()) && !player.isOverflowing) {
    player.isOverflowing = true;
    //player.matter = getOverflowLimit();
  }
  if (player.fusion.matterPoured.gte(fusionUnlockRequiredMatter) && !player.fusion.unlocked) {
    player.fusion.unlocked = true;
  }
}
function main(){
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = (player.currentTime - previousTime) / 1000;
  const diffDecimal = new Decimal(diff);
  variables.diffDecimal = Decimal.fromDecimal(diffDecimal);
  autosaveTimer = autosaveTimer + diff;
  if (autosaveTimer >= 10) {
    save();
    autosaveTimer = 0;
    console.log('game saved!');
  }
  if(input.value.maxAutobuyerIntervalHeld){
    ClickMaxMatterAutobuyerInterval();
  }

  updateGame(diffDecimal);
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
