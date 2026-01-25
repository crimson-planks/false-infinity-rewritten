<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import Credits from './components/Credits.vue';
import { ui, input, handleInput, sanitizedInput, sanitizeStringDecimal, ClickFusionPourMatterButton } from './ui';
import { load, save } from './saveload';
import Upgrade from './components/Upgrade.vue';
import { computed } from 'vue';

</script>
<template>
  <header>
    <TabButton tab="autobuyer" :visible="ui.tabs.autobuyer.visible" />
    <TabButton tab="overflow" :visible="ui.tabs.overflow.visible" />
    <TabButton tab="option" :visible="ui.tabs.option.visible" />
    <TabButton tab="statistics" :visible="ui.tabs.statistics.visible" />
  </header>
  <main>
    You have {{ ui.matter }} matter.<br>
    You are getting {{ ui.matterPerSecond }} matter per second.
    <div v-show="ui.tab==='autobuyer' && !ui.isOverflowing" style="display: block">
      <div>
        <SubtabButton tab="autobuyer" subtab="matter" :data="ui.subtabs.autobuyer.matter"/>
        <SubtabButton tab="autobuyer" subtab="deflation" :data="ui.subtabs.autobuyer.deflation"/>
      </div>
      <div v-show="ui.subtab==='matter'" style="display: block">
        <button @click="handleInput('ClickMatterButton',[])">Click to get matter</button>
        <div>
          <Autobuyer :data="ui.autobuyers.matter[0]" />
          <Autobuyer :data="ui.autobuyers.matter[1]" />
        </div>
        <DeflationButton :deflatorGainOnDeflation="ui.deflatorGainOnDeflation" :deflationCost="ui.deflationCost" :canBuy="ui.canDeflate" />
      </div>
      <div v-show="ui.subtab==='deflation'" style="display: block">
        You have {{ ui.deflationPower }} deflation power, which when ^{{ ui.translatedDeflationPowerExponent }} and *{{ ui.translatedDeflationPowerMultiplier }}, translates to the reduction of the cost of matter autobuyers by {{ ui.translatedDeflationPower }}.<br>
        <button @click="handleInput('ClickDeflationPowerButton',[])">Click to get deflation power</button><br></br>
        Deflator: {{ ui.deflator }}<br><br>
        Deflation Power on previous sacrifice: {{ ui.previousSacrificeDeflationPower }}<br>
        Current Translated Deflation Power Multiplier by Sacrifice: {{ ui.translatedDeflationPowerMultiplierBySacrificedDeflationPower }}<br>
        <button :class="{'button--can-buy': ui.canDeflationSacrifice, 'button--cannot-buy': !ui.canDeflationSacrifice}" @click="handleInput('ClickDeflationSacrificeButton',[])">Set multiplier to {{ ui.translatedDeflationPowerMultiplierWhenSacrifice }} with deflation sacrifice</button>
        <Autobuyer :data="ui.autobuyers.deflationPower[0]" />
      </div>
    </div>
    <div v-show="ui.tab==='overflow'" style="display: block">
      <div>
        <SubtabButton tab="overflow" subtab="upgrades" :data="ui.subtabs.overflow.upgrades"></SubtabButton>
        <SubtabButton tab="overflow" subtab="fusion" :data="ui.subtabs.overflow.fusion"></SubtabButton>
      </div>
      Overflow Points: {{ ui.overflowPoint }}
      <div v-show="ui.subtab==='upgrades'" style="display: block;">
        Upgrades
        <Upgrade v-for="i in Array(8).fill(0).map((v,i)=>i)" :data="ui.upgrades.overflow[i]" />
      </div>
      <div v-show="ui.subtab==='fusion'">
        <div v-show="!ui.fusionUnlocked">
          In order to unlock fusion, you need to pour 1e10 matter.<br>
          You have poured {{ ui.fusionMatterPoured }} matter. ({{ ui.fusionMatterPouredPercentage }}% complete)<br>
          <label for="fusion-pour-matter">Amount of matter to pour: </label>
          <input type="text" id="fusion-pour-matter" v-model="input.fusionPourMatter"><br>
          <button @click="ClickFusionPourMatterButton()">Pour {{ sanitizedInput.fusionPourMatter }} Matter</button>
        </div>
        <p v-show="ui.fusionUnlocked">
          Fusion is Unlocked.
          <button>Convert matter to helium and energy.</button>
        </p>
      </div>
    </div>
    <div v-show="ui.isOverflowing">
        The simulation has overflown due to an excess of matter.<br>
        <button class="o-prestige-button" @click="handleInput('ClickOverflowButton',[])">Overflow</button>
    </div>
  <template v-show="ui.tab==='option'" style="display: block">
    <button @click="save()">Save</button>
    <button @click="load()">Load</button>
    <button @click="ui.creditsVisible=!ui.creditsVisible">Credits</button>
  </template>
  <Credits :visible="ui.creditsVisible" />
  <div v-show="ui.tab==='statistics'" style="display:block">
    <SubtabButton tab="statistics" subtab="general" :data="ui.subtabs.statistics.general"/>
    <div v-show="ui.subtab==='general'">
      You have played for {{ ui.playTime }} milliseconds.<br>
      You have produced a total of {{ ui.totalMatter }} matter.<br>
      You have deflated {{ ui.deflation }} times.<br>

      You have overflown {{ ui.overflow }} times.<br>
    </div>
  </div>
  </main>
</template>

<style>
*{
  font-family: 'Courier New', Courier, monospace;
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
</style>
