<script setup lang="ts">
import { challengeConstObj, type OverflowChallenge } from '@/challenge';
import { computed } from 'vue';

const props = defineProps<{isFusing: boolean; currentChallenge: {overflow: OverflowChallenge | undefined}}>();
const parts = computed(()=>{
  const rslt: string[] = [];
  if(props.isFusing) rslt.push('Fusion');
  if(props.currentChallenge.overflow!=undefined) rslt.push(challengeConstObj[props.currentChallenge.overflow].name);
  return rslt;
})
const visible = computed(()=>parts.value.length>0)
const currentChallengeText = computed(()=>parts.value.join(' + '));
</script>
<template>
  <span v-show="visible">You are currently in {{ currentChallengeText }}.</span>
</template>