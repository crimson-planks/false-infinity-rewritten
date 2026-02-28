<script setup lang="ts">
import { type DecimalSource } from 'break_eternity.js';
import { formatValue, type NotationId } from '@/notation';
import { computed } from 'vue';
const props = defineProps<{ number: DecimalSource; notation: NotationId }>();

const formattedValue = computed(() => formatValue(props.number, props.notation));
</script>

<template>
  {{ formattedValue }}
</template>
