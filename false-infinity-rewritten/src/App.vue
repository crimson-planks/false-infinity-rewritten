<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import DeflationButton from './components/DeflationButton.vue';
import SubtabButton from './components/SubtabButton.vue';
import TabButton from './components/TabButton.vue';
import { ui, input } from './ui';

</script>
<template>
  <header>
    <TabButton tab="autobuyers" />
  </header>
  <main>
    <SubtabButton subtab="matter" />
    <SubtabButton subtab="deflation" />
    {{ ui.matter }}
    <template v-show="ui.subtab==='matter'" style="display: block">
      <button @click="input('ClickMatterButton',[])">Click to get matter</button>
      <Autobuyer :data="ui.autobuyers.matter[0]" />
      <Autobuyer :data="ui.autobuyers.matter[1]" />
      <DeflationButton :deflationCost="ui.deflationCost" />
    </template>
    <template v-show="ui.subtab==='deflation'" style="display: block">
      {{ ui.deflationPower }}
      <button @click="input('ClickDeflationPowerButton',[])">Click to get deflation power</button>
      {{ ui.translatedDeflationPower }}
  </template>
  </main>
</template>

<style>
*{
  font-family: 'Courier New', Courier, monospace;
}
</style>
