<script setup lang="ts">
import Autobuyer from './components/Autobuyer.vue';
import { ui, input } from './ui';

</script>
<template>
  <header></header>

  <main>
    {{ ui.matter }}
    <button @click="input('ClickMatterButton',[])">Click to get matter</button>
    <Autobuyer :data="ui.autobuyers.matter[0]" />
  </main>
</template>

<style></style>
