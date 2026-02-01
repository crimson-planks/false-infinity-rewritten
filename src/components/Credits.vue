<script setup lang="ts">
import { ui } from '@/ui';

const props = defineProps<{visible: boolean}>();
</script>
<template>
<div class="credits-box" v-show="visible">
  <button @click="ui.creditsVisible=false">Close</button>
  <h1>Credits</h1><br>
  <h2>Libraries Used</h2><br>
  Vue.js<br>

  jQuery<br>

  <a href="https://github.com/Patashu/break_eternity.js">break_eternity.js (v2.1.3)</a><br>

  <a href="https://github.com/MathCookie17/Eternal-Notations">eternal_notations</a><br>

  <h2>Inspirations</h2><br>

  <a href="https://reinhardt-c.github.io/TrueInfinity/">True Infinity</a>, for inspiring me the name of this game<br>

  sitelen pona, for the game's logo (lon ale ala)<br>

  <a href="https://patcailmemer.github.io/Ordinal-Markup/">Ordinal Markup</a>, for inspiration for extend overflow (not implemented)
</div>


</template>
<style>
.credits-box{
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  width: 80%;
  height: 70%;
  background-color: white;
  border: 5px solid black;
  text-align: center;
}
</style>