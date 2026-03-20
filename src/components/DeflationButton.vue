<script setup lang="ts">
import type Decimal from 'break_eternity.js';
import { deflate } from '@/prestige';
import { getBuyableClassBinding } from '@/ui';
const props = defineProps<{deflation: string;deflatorGainOnDeflation: string; deflationCost: string, canBuy: boolean}>();
function ClickDeflationButton(){
  deflate();
}
</script>
<template>
  <button class="o-prestige-button c-deflation-button" :class="getBuyableClassBinding(canBuy)" @click="ClickDeflationButton">Deflate ({{ deflation }})<br/>Cost: {{ deflationCost }}
  <br>
  Get {{ deflatorGainOnDeflation }} deflators
  </button>
</template>
<style>
</style>