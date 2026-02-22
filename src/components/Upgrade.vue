<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { texts, type UpgradeVisualData } from '@/ui';
import { BuyUpgrade } from '@/upgrade';
import { upgradeConstData } from '@/upgrade';
const props = defineProps<{data: UpgradeVisualData}>();

function ClickBuyUpgradeButton(){
  BuyUpgrade(props.data.kind, props.data.ord, Decimal.dOne);
}
</script>
<template>
<div class="c-upgrade" :class="{'upgrade--bought-max': data.boughtMax, 'button--can-buy': !data.boughtMax && data.canBuy, 'button--cannot-buy': !data.boughtMax && !data.canBuy}" @click="ClickBuyUpgradeButton()">
  <span class="c-upgrade-name">{{ data.kind }} Upgrade {{ data.ord }}</span><br>
  <span class="c-upgrade-text">{{ texts['en-US'].upgrades[data.kind][data.ord].description }}</span><br>
  <span class="c-upgrade-text">Amount: {{ data.amount }} / {{ data.maxAmount }}</span><br>
  <span v-show="!data.boughtMax" class="c-upgrade-text">Cost: {{ data.cost }}</span><br>
  <span class="c-upgrade-text">Effect Value: {{ data.effectValue }}</span>
</div>
</template>
<style>
.c-upgrade{
  width: 250px;
  height: 150px;
}
.c-upgrade-name{
  width:100%;
  font-size: 20px;
  text-align: center;
}
.upgrade--bought-max{
  border-color: #2762b5;
  background-color: #3d73bf;
  cursor: not-allowed;
}
.upgrade--bought-max:hover{
  background-color: #2762b5;
}
</style>