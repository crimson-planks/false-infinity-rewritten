<script setup lang="ts">
import { computed } from 'vue';
import { BuyMaxInterval } from './autobuyer';
import Autobuyer from './components/Autobuyer.vue';
import Credits from './components/Credits.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import Upgrade from './components/Upgrade.vue';
import { VERSION_STR } from './constants';
import { notations } from './notation';
import { load, save } from './saveload';
import { ClickFusionPourMatterButton, getBuyableClassBinding, input, inputFunctions, notationGroups, sanitizedInput, ui } from './ui';

</script>
<template>
  <header>
    <span id="version">False Infinity Rewritten v{{ VERSION_STR }}</span>
    <nav class="o-navigation-bar">
      <TabButton tab="autobuyer" :visible="ui.tabs.autobuyer.visible" />
      <TabButton tab="overflow" :visible="ui.tabs.overflow.visible" />
      <TabButton tab="option" :visible="ui.tabs.option.visible" />
      <TabButton tab="statistics" :visible="ui.tabs.statistics.visible" />
    </nav>
  </header>
  <main>
    <div id="matter-info" class="middle description">
      <p id="matter-text">You have <span class="currency">{{ ui.matter }}</span> matter.</p>
      <p id="matter-per-second-text">You are getting {{ ui.matterPerSecond }} matter per second.</p>
    </div>
    <div v-show="ui.currentTab==='autobuyer'" style="display: block">
      <div class="o-subtab-bar">
        <SubtabButton tab="autobuyer" subtab="matter" :data="ui.subtabs.autobuyer.matter"/>
        <SubtabButton tab="autobuyer" subtab="deflation" :data="ui.subtabs.autobuyer.deflation"/>
        <SubtabButton tab="autobuyer" subtab="overflow" :data="ui.subtabs.autobuyer.overflow"/>
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='matter' && !ui.isOverflowing" style="display: block">
        <button class="o-gain-currency-button" @click="inputFunctions.ClickMatterButton">Click to get matter</button>
        <div>
          <p v-show="ui.hasDeflated">By deflating, the cost scaling of matter autobuyers has been decreased by {{ ui.matterAutobuyerCostScalingReductionByDeflation }}.</p>
          <button @pointerout="input.maxAutobuyerIntervalHeld=false"
                  @pointerdown="input.maxAutobuyerIntervalHeld=true"
                  @pointerup="input.maxAutobuyerIntervalHeld=false"
                  @click="inputFunctions.ClickMaxMatterAutobuyerInterval"
                  :class="{'max-button-held': input.maxAutobuyerIntervalHeld}">
            Max Autobuyer Interval (Hold this button or hold M)
          </button>
          <Autobuyer :data="ui.autobuyers.matter[0]" />
          <Autobuyer :data="ui.autobuyers.matter[1]" />
        </div>
        <DeflationButton :deflatorGainOnDeflation="ui.deflatorGainOnDeflation" :deflationCost="ui.deflationCost" :canBuy="ui.canDeflate" />
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='deflation' && !ui.isOverflowing" style="display: block">
        You have <span class="currency">{{ ui.deflationPower }}</span> deflation power, which when ^{{ ui.translatedDeflationPowerExponent }} and *{{ ui.translatedDeflationPowerMultiplier }}, translates to the reduction of the cost of matter autobuyers by {{ ui.translatedDeflationPower }}.<br>
        <button class="o-gain-currency-button" @click="inputFunctions.ClickDeflationPowerButton">Click to get deflation power</button><br></br>
        Deflator: {{ ui.deflator }}<br><br>
        Deflation Power on previous sacrifice: {{ ui.previousSacrificeDeflationPower }}<br>
        Current Translated Deflation Power Multiplier by Sacrifice: {{ ui.translatedDeflationPowerMultiplierBySacrificedDeflationPower }}<br>
        <button :class="{'button--can-buy': ui.canDeflationSacrifice, 'button--cannot-buy': !ui.canDeflationSacrifice}" @click="inputFunctions.ClickDeflationSacrificeButton">Set multiplier to {{ ui.translatedDeflationPowerMultiplierWhenSacrifice }} with deflation sacrifice</button>
        <Autobuyer :data="ui.autobuyers.deflationPower[0]" />
      </div>
      <div v-show="ui.isOverflowing && (ui.subtabs.autobuyer.currentSubtab==='matter' || ui.subtabs.autobuyer.currentSubtab==='deflation')">
        The simulation has overflown due to an excess of matter.<br>
        <button class="o-prestige-button" @click="inputFunctions.ClickOverflowButton">Overflow</button>
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='overflow'" style="display: block">
        <Autobuyer :data="ui.autobuyers.matterAutobuyer[0]"></Autobuyer>
        <Autobuyer :data="ui.autobuyers.matterAutobuyer[1]"></Autobuyer>
        <Autobuyer :data="ui.autobuyers.matterAutobuyer[2]"></Autobuyer>
        <Autobuyer :data="ui.autobuyers.matterAutobuyer[3]"></Autobuyer>
        <Autobuyer :data="ui.autobuyers.matterAutobuyer[4]"></Autobuyer>
      </div>
    </div>
    <div v-show="ui.currentTab==='overflow'" style="display: block">
      <div class="o-subtab-bar">
        <SubtabButton tab="overflow" subtab="upgrades" :data="ui.subtabs.overflow.upgrades"></SubtabButton>
        <SubtabButton tab="overflow" subtab="fusion" :data="ui.subtabs.overflow.fusion"></SubtabButton>
      </div>
      You have <span class="currency">{{ ui.overflowPoint }}</span> Overflow points.
      <div v-show="ui.subtabs.overflow.currentSubtab==='upgrades'" style="display: block;">
        <p>Upgrades</p>
        <Upgrade v-for="i in Array(ui.upgrades.overflow.length).fill(0).map((v,i)=>i)" :data="ui.upgrades.overflow[i]" />
      </div>
      <div v-show="ui.subtabs.overflow.currentSubtab==='fusion'">
        <div v-show="!ui.fusionUnlocked">
          In order to unlock fusion, you need to pour 1e10 matter.<br>
          You have poured {{ ui.fusionMatterPoured }} matter. ({{ ui.fusionMatterPouredPercentage }}% complete)<br>
          <label for="fusion-pour-matter">Amount of matter to pour: </label>
          <input type="text" id="fusion-pour-matter" v-model="input.fusionUnlockPourMatter"><br>
          <button @click="ClickFusionPourMatterButton()">Pour {{ sanitizedInput.fusionUnlockPourMatter }} Matter</button>
        </div>
        <div v-show="ui.fusionUnlocked">
          <p>Fusion is Unlocked.</p>
          You have <span class="currency">{{ ui.star }}</span> stars.
          <button @click="inputFunctions.BuyStar" :class="getBuyableClassBinding(ui.canBuyStar)">Buy a star. Cost: {{ ui.starCost }}</button>
          You allocated {{ ui.allocatedStar }} stars.<br>
          <input type="text" id="star-allocate-input" v-model="input.starAllocateAmount"><br>
          <button @click="inputFunctions.AllocateStar(sanitizedInput.starAllocateAmount.value)">Allocate {{ sanitizedInput.starAllocateAmount }} stars.</button>
          <button @click="inputFunctions.AllocateStar(sanitizedInput.starAllocateAmount.value.neg())">Allocate {{ sanitizedInput.starAllocateAmount.value.neg() }} stars.</button>
          You have <span class="currency">{{ ui.helium }}</span> (helium)<br>
          You have <span class="currency">{{ ui.energy }}</span> (energy), which multiplies the effect of deflation power by {{ ui.energyEffect }}<br>
        </div>
      </div>
    </div>
  <div v-show="ui.currentTab==='option'" style="display: block">
    <button @click="save()" class="o-option-button">Save</button>
    <button @click="load()" class="o-option-button">Load</button>
    <button @click="ui.creditsVisible=!ui.creditsVisible" class="o-option-button">Credits</button>
    <button @click="inputFunctions.ToggleNotationSelectWindow" class="o-option-button">
      Notation: {{notations[ui.notationId].name }}
    </button>
    <div id="notation-select-window" v-show="ui.notationSelectWindowVisible">
      <div v-for="notationGroup in notationGroups">
        <button v-for="notation in notationGroup" @click="inputFunctions.ChangeNotation(notation)" class="o-notation-select-button">
          {{ notations[notation].name }}
        </button>
      </div>
      <button id="close-toggle-notation-select" @click="inputFunctions.ToggleNotationSelectWindow" class="o-option-button">Close</button>
    </div>
  </div>
  <Credits :visible="ui.creditsVisible" />
  <div v-show="ui.currentTab==='statistics'" style="display:block">
    <div class="o-subtab-bar">
      <SubtabButton tab="statistics" subtab="general" :data="ui.subtabs.statistics.general"/>
    </div>
    <div v-show="ui.subtabs.statistics.currentSubtab==='general'">
      <h1>Statistics</h1>
      <h2>General</h2>
      You have played for {{ ui.playTime }} milliseconds.<br>
      You have produced a total of {{ ui.totalMatter }} matter.<br>
      You have deflated {{ ui.deflation }} times.<br>
      You are on this deflation for {{ ui.statistics.timeOnDeflation }} milliseconds.<br>
      <div v-show="ui.statistics.overflow.visible">
        <h2>Overflow</h2>
        You are on this overflow for {{ ui.statistics.overflow.timeOn }} milliseconds.<br>
        You have overflown {{ ui.overflow }} times.<br>
      </div>
    </div>
  </div>
  </main>
</template>

<style>
*{
  font-family: 'Courier New', Courier, monospace;
  touch-action: manipulation;
}
button,p,span{
  font-size: 18px;
}
#version{
  position: fixed;
  bottom: 0px;
  right: 0px;
}
.o-navigation-bar{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.middle{
  width: 100%;
  text-align: center;
}
.o-subtab-bar{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.o-option-button{
  border-color: #2762b5;
  background-color: #3d73bf;
  width: 150px;
  min-height: 50px;
}
.o-option-button:hover{
  background-color: #2762b5;
}
.description{
  color:gray;
}
.o-gain-currency-button{
  border-color:tomato;
  background-color: orange;
}
.o-gain-currency-button:hover{
  background-color: tomato;
}
#notation-select-window{
  border: 2px solid black;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.o-notation-select-button{
  min-width: 200px;
  height: 50px;
}
#close-toggle-notation-select{
  margin-top: 20px;
}
.currency{
  color:black;
  font-size: 28px;
}
.max-button-held{
  border: 2px solid black;
  background-color: plum;
}
.button--can-buy{
  border-color: #42b153;
  background-color: #6ad47a;
  cursor: pointer;

}
.button--can-buy:hover{
    background-color: #42b153;
}
.button--cannot-buy{
    border-color: #9e9e9e;
    background-color: #afafaf;
    cursor: not-allowed;
}
.button--cannot-buy:hover{
    background-color: #9e9e9e;
}
.not-implemented{
  text-decoration: line-through;
  background-color: gray;
  cursor: not-allowed;
}
</style>
