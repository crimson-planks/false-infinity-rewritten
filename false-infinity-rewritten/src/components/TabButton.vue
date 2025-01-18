<script setup lang="ts">
import { input, type TabName } from '@/ui';
const props = defineProps<{tab: TabName}>();

function ChangeTab(tab: TabName){
  input("ChangeTab",[tab]);
}
</script>
<template>
  <button @click="ChangeTab(props.tab)">{{ props.tab }}</button>
</template>