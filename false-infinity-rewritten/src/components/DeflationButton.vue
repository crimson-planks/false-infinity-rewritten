<script setup lang="ts">
import { deflate } from '@/prestige';
const props = defineProps<{deflationCost: string}>();
function ClickDeflationButton(){
  deflate();
}
</script>
<template>
  <button class="o-prestige-button c-deflation-button" @click="ClickDeflationButton">Deflate<br/>Cost: {{ deflationCost }}</button>
</template>
<style>
.c-deflation-button{
  background-color: #222222;
}
</style>