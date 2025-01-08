<script setup lang="ts">
import { deflate } from '@/prestige';
const props = defineProps<{deflationCost: string}>();
function ClickDeflationButton(){
  deflate();
}
</script>
<template>
  <button @click="ClickDeflationButton">Deflate<br/>Cost: {{ deflationCost }}</button>
</template>