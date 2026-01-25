<script setup lang="ts">
import type Decimal from '@/lib/break_eternity';
import { deflate } from '@/prestige';
const props = defineProps<{deflatorGainOnDeflation: string; deflationCost: string, canBuy: boolean}>();
function ClickDeflationButton(){
  deflate();
}
</script>
<template>
  <button class="o-prestige-button c-deflation-button" :class="{'button--can-buy': canBuy, 'button--cannot-buy': !canBuy}" @click="ClickDeflationButton">Deflate<br/>Cost: {{ deflationCost }}
  <br>
  Get {{ deflatorGainOnDeflation }} deflators
  </button>
</template>
<style>
</style>