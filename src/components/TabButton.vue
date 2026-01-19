<script setup lang="ts">
import { input, type TabName } from '@/ui';
const props = defineProps<{tab: TabName; visible: boolean}>();

function ChangeTab(tab: TabName){
  input("ChangeTab",[tab]);
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