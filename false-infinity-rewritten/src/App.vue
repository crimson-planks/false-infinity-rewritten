<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import { ui, input } from './ui';

</script>
<template>
  <header>
    <TabButton tab="autobuyer" />
    <TabButton tab="option" />
  </header>
  <main>
    <template v-show="ui.tab==='autobuyer'" style="display: block">
      <div>
        <SubtabButton tab="autobuyer" subtab="matter" />
        <SubtabButton tab="autobuyer" subtab="deflation" />
      </div>
      Matter: {{ ui.matter }}
      <template v-show="ui.subtab==='matter'" style="display: block">
        <button @click="input('ClickMatterButton',[])">Click to get matter</button>
        <div>
          <Autobuyer :data="ui.autobuyers.matter[0]" />
          <Autobuyer :data="ui.autobuyers.matter[1]" />
        </div>
        <DeflationButton :deflationCost="ui.deflationCost" />
      </template>
      <template v-show="ui.subtab==='deflation'" style="display: block">
        {{ ui.deflationPower }}
        <button @click="input('ClickDeflationPowerButton',[])">Click to get deflation power</button>
        {{ ui.translatedDeflationPower }}<br>
        Deflator: {{ ui.deflator }}
        <Autobuyer :data="ui.autobuyers.deflationPower[0]" />
      </template>
    </template>
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
