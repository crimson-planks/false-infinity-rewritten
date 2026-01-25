<script setup lang="ts">
import { handleInput, type TabName } from '@/ui';
const props = defineProps<{tab: TabName; visible: boolean}>();

function ChangeTab(tab: TabName){
  handleInput("ChangeTab",[tab]);
}
</script>
<template>
  <span class="o-tab-button" v-show="visible" @click="ChangeTab(props.tab)">{{ props.tab }}</span>
</template>
<style>
.o-tab-button{
  font-size: 20px;
  margin-right: 30px;
}
</style>