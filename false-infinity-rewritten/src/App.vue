<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import { ui, input } from './ui';

</script>
<template>
  <header>
    <TabButton tab="autobuyer" :visible="ui.tabs.autobuyer.visible" />
    <TabButton tab="overflow" :visible="ui.tabs.overflow.visible" />
    <TabButton tab="option" :visible="ui.tabs.option.visible" />
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
        <button @click="input('ClickMatterButton',[])">Click to get matter</button>
        <div>
          <Autobuyer :data="ui.autobuyers.matter[0]" />
          <Autobuyer :data="ui.autobuyers.matter[1]" />
        </div>
        <DeflationButton :deflationCost="ui.deflationCost" :canBuy="ui.canDeflate" />
      </div>
      <div v-show="ui.subtab==='deflation'" style="display: block">
        You have {{ ui.deflationPower }} deflation power, which reduces the cost of matter autobuyers by {{ ui.translatedDeflationPower }}.
        <button @click="input('ClickDeflationPowerButton',[])">Click to get deflation power</button><br></br>
        Deflator: {{ ui.deflator }}<br></br>
        Deflation Power on previous sacrifice: {{ ui.previousSacrificeDeflationPower }}
        <button @click="input('ClickDeflationSacrificeButton',[])">Get {{ ui.deflatorAmountWhenSacrifice }} deflators with deflation sacrifice</button>
        <Autobuyer :data="ui.autobuyers.deflationPower[0]" />
      </div>
    </div>
    <div v-show="ui.isOverflowing">
        The simulation has overflown due to an excess of matter.<br>
        <button>Overflow</button>
    </div>
  <template v-show="ui.tab==='option'" style="display: block">
    <button>save</button>
    <button>load</button>
  </template>
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
