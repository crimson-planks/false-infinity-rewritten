<script setup lang="ts">
import { deflate } from '@/prestige';
const props = defineProps<{deflationCost: string, canBuy: boolean}>();
function ClickDeflationButton(){
  deflate();
}
</script>
<template>
  <button class="o-prestige-button c-deflation-button" :class="{'button--can-buy': props.canBuy, 'button--cannot-buy': !props.canBuy}" @click="ClickDeflationButton">Deflate<br/>Cost: {{ deflationCost }}</button>
</template>
<style>
</style>