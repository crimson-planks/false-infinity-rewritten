<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import DeflationButton from './components/DeflationButton.vue';
import { ui, input } from './ui';

</script>
<template>
  <header></header>

  <main>
    {{ ui.matter }}
    <button @click="input('ClickMatterButton',[])">Click to get matter</button>
    <Autobuyer :data="ui.autobuyers.matter[0]" />
    <Autobuyer :data="ui.autobuyers.matter[1]" />
    <DeflationButton :deflationCost="ui.deflationCost" />
  </main>
</template>

<style></style>
