<script setup lang="ts">
import { input, type TabName } from '@/ui';
const props = defineProps<{tab: TabName}>();

function ChangeTab(tab: TabName){
  input("ChangeTab",[tab]);
}
</script>
<template>
  <span class="o-tab-button" @click="ChangeTab(props.tab)">{{ props.tab }}</span>
</template>
<style>
.o-tab-button{
  font-size: 20px;
  margin-right: 30px;
}
</style>