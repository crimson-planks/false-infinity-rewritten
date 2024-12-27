<script setup lang="ts">
import { ref } from 'vue'
import Decimal from './break_eternity.mjs'
const number = ref(new Decimal('1e100'))
</script>
<template>
  <header></header>

  <main>
    {{ number }}
  </main>
</template>

<style scoped></style>
