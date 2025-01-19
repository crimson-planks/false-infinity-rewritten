<script setup lang="ts">
import { input, type TabName } from '@/ui';
const props = defineProps<{tab: TabName}>();

function ChangeTab(tab: TabName){
  input("ChangeTab",[tab]);
}
</script>
<template>
  <h2 class="o-tab-button" @click="ChangeTab(props.tab)">{{ props.tab }}</h2>
</template>
<style>
.o-tab-button{
  font-size: 20px;
}
</style>