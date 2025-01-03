<script setup lang="ts">
import { BuyAutobuyer } from '@/autobuyer';
import type { AutobuyerVisualData } from '@/ui';

const props = defineProps<{data: AutobuyerVisualData}>();
function ClickBuyAutobuyerButton(){
  BuyAutobuyer(props.data.kind, props.data.ord);
}
</script>
<template>
  Amount: {{ props.data.amount }}<br />
  <button @click="ClickBuyAutobuyerButton">Cost: {{ props.data.cost }}</button><br />
  Interval: {{ props.data.interval }}<br />
  Timer: {{ props.data.timer }}
</template>
