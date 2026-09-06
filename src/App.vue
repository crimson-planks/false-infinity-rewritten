<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import Credits from './components/Credits.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import Upgrade from './components/Upgrade.vue';
import { VERSION_STR } from './constants';
import { notations } from './notation';
import { load, save } from './saveload';
import { ClickFusionPourMatterButton, getBuyableClassBinding, input, inputFunctions, notationGroups, sanitizedInput, texts, ui } from './ui';
import HeaderChallengeDisplay from './components/HeaderChallengeDisplay.vue';
import ChallengeBox from './components/ChallengeBox.vue';
import { player } from './player.ts';

</script>
<template>
  <header>
    <span id="version">False Infinity Rewritten v{{ VERSION_STR }}</span>
    <nav class="o-navigation-bar">
      <TabButton tab="autobuyer" :visible="ui.tabs.autobuyer.visible" />
      <TabButton tab="overflow" :visible="ui.tabs.overflow.visible" />
      <TabButton tab="challenge" :visible="ui.tabs.challenge.visible" />
      <TabButton tab="option" :visible="ui.tabs.option.visible" />
      <TabButton tab="statistics" :visible="ui.tabs.statistics.visible" />
    </nav>
  </header>
  <main>
    <div id="matter-info" class="middle description">
      <HeaderChallengeDisplay :isFusing="ui.isFusing" :currentChallenge="ui.currentChallenge" class="main-text"/>
      <p v-show="ui.currentChallenge.overflow=='oc3'">You have {{ ui.challengeStuff.inflationPower }} inflation power.</p>
      <p id="matter-text">You have <span class="currency">{{ ui.matter }}</span> matter.</p>
      <p id="matter-per-second-text">You are getting {{ ui.matterPerSecond }} matter per second.</p>
      <p v-show="ui.isFusing">Due to fusion, your matter is multiplied by {{ ui.matterDecay_dueTo_fusion }} every second.</p>
    </div>
    <div v-show="ui.currentTab==='autobuyer'" style="display: block">
      <div class="o-subtab-bar">
        <SubtabButton tab="autobuyer" subtab="matter" :data="ui.subtabs.autobuyer.matter"/>
        <SubtabButton tab="autobuyer" subtab="deflation" :data="ui.subtabs.autobuyer.deflation"/>
        <SubtabButton tab="autobuyer" subtab="overflow" :data="ui.subtabs.autobuyer.overflow"/>
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='matter' && ui.subtabs.autobuyer.matter.visible && !ui.isOverflowing" style="display: block">
        <button class="o-gain-currency-button" @click="inputFunctions.ClickMatterButton">Click to get matter</button>
        <div>
          <template v-if="ui.isMoleUnlocked">matter autobuyer interval multiplier by bying: {{ ui.matterAutobuyerIntervalMultiplierByBying }}</template>
          <p v-show="ui.hasOverflowed">If your matter per second stays constant, you will overflow in {{ ui.estimatedOverflowTime }}.</p>
          <p v-show="ui.hasDeflated">By deflating, the cost scaling of matter autobuyers has been decreased by {{ ui.matterAutobuyerCostScalingReductionByDeflation }}.</p>
          <button @pointerout="input.maxAutobuyerIntervalHeld=false"
                  @pointerdown="input.maxAutobuyerIntervalHeld=true"
                  @pointerup="input.maxAutobuyerIntervalHeld=false"
                  @click="inputFunctions.ClickMaxMatterAutobuyerInterval"
                  :class="{'max-button-held': input.maxAutobuyerIntervalHeld}">
            Max Autobuyer Interval (Hold this button or hold M)
          </button>
          <div id="matter-tab-flexbox">
            <div id="matter-tab-autobuyer-column">
              <Autobuyer :data="ui.autobuyers.matter[0]" />
              <Autobuyer :data="ui.autobuyers.matter[1]" />
              <Autobuyer :data="ui.autobuyers.matter[2]" />
            </div>
            <div id="matter-tab-prestige-column">
              <DeflationButton :deflation="ui.deflation" :deflatorGainOnDeflation="ui.deflatorGainOnDeflation" :deflationCost="ui.deflationCost" :canBuy="ui.canDeflate" />
              <button v-if="ui.isMoleUnlocked" class="o-prestige-button c-molereset-button" :class="getBuyableClassBinding(ui.canMoleReset)" @click="inputFunctions.ClickMoleResetButton">Mole Reset ({{ ui.mole }})<br>Cost: {{ ui.moleCost }}</button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='deflation' && ui.subtabs.autobuyer.deflation.visible && !ui.isOverflowing" style="display: block">
        You have <span class="currency">{{ ui.deflationPower }}</span> deflation power,<br>
        which when ^{{ ui.translatedDeflationPowerExponent }} and &times;{{ ui.translatedDeflationPowerMultiplier }},<br>
        translates to the reduction of the cost of matter autobuyers by {{ ui.translatedDeflationPower }}.<br>
        <button class="o-gain-currency-button" @click="inputFunctions.ClickDeflationPowerButton">Click to get deflation power</button><br></br>
        Deflator: {{ ui.deflator }}<br><br>
        Deflation Power on previous sacrifice: {{ ui.previousSacrificeDeflationPower }}<br>
        Current Translated Deflation Power Multiplier by Sacrifice: {{ ui.translatedDeflationPowerMultiplierBySacrificedDeflationPower }}<br>
        <button :class="getBuyableClassBinding(ui.canDeflationSacrifice)" @click="inputFunctions.ClickDeflationSacrificeButton">Set multiplier to {{ ui.translatedDeflationPowerMultiplierWhenSacrifice }} with deflation sacrifice</button><br>
        Based on your deflation amount ^{{ ui.deflationCosteflationPowerAutobuyerIntervalDivideExponentByDeflation }}, your deflation power autobuyer interval is divided by {{ ui.deflationPowerAutobuyerIntervalDivideByDeflation }}
        <Autobuyer :data="ui.autobuyers.deflationPower[0]" />
      </div>
      <div v-show="ui.isOverflowing && (ui.subtabs.autobuyer.currentSubtab==='matter' || ui.subtabs.autobuyer.currentSubtab==='deflation')">
        The simulation has overflown due to an excess of matter.<br>
        <button class="o-prestige-button" @click="inputFunctions.ClickOverflowButton">Overflow</button>
      </div>
      <div v-show="ui.subtabs.autobuyer.currentSubtab==='overflow'" style="display: block">
        <button class="o-prestige-button" v-if="ui.overflowAutobuyer.bought<5" @click="inputFunctions.ClickBuyOverflowAutobuyerButton">Unlock next overflow autobuyer ({{ texts['en-US'].overflowAutobuyer.names[ui.overflowAutobuyer.bought] }})<br>Cost: {{ ui.overflowAutobuyer.cost }} </button>
        <div v-if="ui.overflowAutobuyer.bought>=1">{{ texts['en-US'].overflowAutobuyer.names[0] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(0)">Toggle: {{ ui.overflowAutobuyer.option[0].toggle }}</button><label>Interval: </label><input type="text" v-model="input.overflowAutobuyerOption[0].interval"></div>
        <div v-if="ui.overflowAutobuyer.bought>=2">{{ texts['en-US'].overflowAutobuyer.names[1] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(1)">Toggle: {{ ui.overflowAutobuyer.option[1].toggle }}</button></div>
        <div v-if="ui.overflowAutobuyer.bought>=3">{{ texts['en-US'].overflowAutobuyer.names[2] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(2)">Toggle: {{ ui.overflowAutobuyer.option[2].toggle }}</button></div>
        <div v-if="ui.overflowAutobuyer.bought>=4">{{ texts['en-US'].overflowAutobuyer.names[3] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(3)">Toggle: {{ ui.overflowAutobuyer.option[3].toggle }}</button></div>
        <div v-if="ui.overflowAutobuyer.bought>=5">{{ texts['en-US'].overflowAutobuyer.names[4] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(4)">Toggle: {{ ui.overflowAutobuyer.option[4].toggle }}</button></div>
        <div v-if="ui.overflowAutobuyer.bought>=6">{{ texts['en-US'].overflowAutobuyer.names[5] }}: <button @click="inputFunctions.ToggleOverflowAutobuyer(5)">Toggle: {{ ui.overflowAutobuyer.option[5].toggle }}</button></div>
      </div>
    </div>
    <div v-show="ui.currentTab==='overflow'" style="display: block">
      <div class="o-subtab-bar">
        <SubtabButton tab="overflow" subtab="upgrades" :data="ui.subtabs.overflow.upgrades"></SubtabButton>
        <SubtabButton tab="overflow" subtab="fusion" :data="ui.subtabs.overflow.fusion"></SubtabButton>
        <SubtabButton tab="overflow" subtab="extend" :data="ui.subtabs.overflow.extend"></SubtabButton>
      </div>
      You have <span class="currency">{{ ui.overflowPoint }}</span> Overflow points.<br>
      When you overflow, you will get {{ ui.overflowPointWhenOverflow }} Overflow points.
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
          <button @click="inputFunctions.ClickToggleFusionButton">{{ ui.isFusing ? 'End' : 'Start' }} Fusion</button><br>
          You have <span class="currency">{{ ui.star }}</span> stars.
          <button @click="inputFunctions.BuyStar" :class="getBuyableClassBinding(ui.canBuyStar)">Buy a star. Cost: {{ ui.starCost }}</button><br>
          You allocated {{ ui.allocatedStar }} stars, which increase the amount of helium generated during fusion, but make the fusion penalty worse.<br>
          <input type="text" id="star-allocate-input" v-model="input.starAllocateAmount"><br>
          <button @click="inputFunctions.AllocateStar(sanitizedInput.starAllocateAmount.value)">Allocate {{ sanitizedInput.starAllocateAmount }} stars.</button>
          <button @click="inputFunctions.AllocateStar(sanitizedInput.starAllocateAmount.value.neg())">Allocate {{ sanitizedInput.starAllocateAmount.value.neg() }} stars.</button><br>
          You have <span class="currency">{{ ui.helium }}</span> (helium)<br>
          <span :style="{'text-decoration': ui.isFusing ? 'none' : 'line-through'}">You are getting {{ ui.heliumPerSecond }} helium per second.<br></span>
          You have <span class="currency">{{ ui.energy }}</span> (energy), which powers the multiplier to translated deflation power by sacrificed deflation power by ^{{ ui.energyEffect }}<br>
          When overflowing during fusion, you will get <span class="currency">{{ ui.energyGainWhenFusing }}</span> eV (energy).<br>
          <Upgrade v-for="i in Array(ui.upgrades.helium.length).fill(0).map((v,i)=>i)" :data="ui.upgrades.helium[i]" />
        </div>
      </div>
      <div v-show="ui.subtabs.overflow.currentSubtab=='extend'">
        You can extend the overflow limit.<br>
        You can extend up to a maximum of {{ ui.extendOverflowTotalAmount }}.<br>
        Your current extension level is <span class="currency">{{ ui.extendOverflowLevel }}</span>.<br>
        Your current overflow limit is <span class="currency">{{ ui.overflowLimit }}</span>.<br>
        Your overflow point gain is multiplied by <span class="currency">{{ ui.overflowPointMultiplierByExtension }}</span>.<br>
        When overflowing during fusion, you will get <span class="currency">{{ ui.energyGainWhenFusing }}</span> eV (energy).<br>
        <input type="range" id="overflow-extension-range" name="overflow-extension-range" min="0" :max="ui.htmlAttributes.overflowExtensionRange_max" :disabled="ui.changeExtensionLevelDisabled" v-model="input.OverflowExtensionLevel">
        <br>
        <button @click="inputFunctions.BuyExtendOverflow('matter')" :class="getBuyableClassBinding(ui.extendOverflow.matter.canBuy)">Extend by spending {{ ui.extendOverflow.matter.cost }} matter</button>
        <button @click="inputFunctions.BuyExtendOverflow('deflationPower')" :class="getBuyableClassBinding(ui.extendOverflow.deflationPower.canBuy)">Extend by spending {{ ui.extendOverflow.deflationPower.cost }} deflation power</button>
        <button @click="inputFunctions.BuyExtendOverflow('overflowPoint')" :class="getBuyableClassBinding(ui.extendOverflow.overflowPoint.canBuy)">Extend by spending {{ ui.extendOverflow.overflowPoint.cost }} overflow points</button>
        <button @click="inputFunctions.BuyExtendOverflow('helium')" :class="getBuyableClassBinding(ui.extendOverflow.helium.canBuy)">Extend by spending {{ ui.extendOverflow.helium.cost }} helium</button>
      </div>
    </div>
  <div v-show="ui.currentTab==='challenge'" style="display: block;">
    <SubtabButton tab="challenge" subtab="overflow" :data="ui.subtabs.autobuyer.overflow"/>
    <div v-show="ui.subtabs.challenge.currentSubtab==='overflow'">
      <button @click="inputFunctions.ClickExitOverflowChallenge">Exit Overflow Challenge</button>
      <ChallengeBox challengeId="oc1"/>
      <ChallengeBox challengeId="oc2"/>
      <ChallengeBox challengeId="oc3"/>
      <ChallengeBox challengeId="oc4"/>
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
    <br>
    <a href="./changelog/index.html">Changelog</a>
  </div>
  <Credits :visible="ui.creditsVisible" />
  <div v-show="ui.currentTab==='statistics'" style="display:block">
    <div class="o-subtab-bar">
      <SubtabButton tab="statistics" subtab="general" :data="ui.subtabs.statistics.general"/>
    </div>
    <div v-show="ui.subtabs.statistics.currentSubtab==='general'">
      <h1>Statistics</h1>
      <h2>General</h2>
      You have played for {{ ui.playTime }}.<br>
      You have produced a total of {{ ui.totalMatter }} matter.<br>
      You have deflated {{ ui.deflation }} times.<br>
      You are on this deflation for {{ ui.statistics.timeOnDeflation }}.<br>
      <div v-show="ui.statistics.overflow.visible">
        <h2>Overflow</h2>
        You are on this overflow for {{ ui.statistics.overflow.timeOn }}.<br>
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
button{
  color: black;
}
.main-text{
  font-size: 18px;
}
button,p{
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
#matter-tab-flexbox{
  display:flex;
  flex-direction: row;
}
.o-prestige-button{
    width: 200px;
    height: 150px;
    border-radius: 5px;
}
#overflow-extension-range{
  min-width:200px;
  width: 100%;
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
