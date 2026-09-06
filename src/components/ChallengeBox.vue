<script setup lang="ts">
import { challengeConstObj, type OverflowChallenge } from '@/challenge';
import { CurrencyName } from '@/currency';
import { formatValue } from '@/notation';
import { player } from '@/player';
import { inputFunctions, texts, ui } from '@/ui';
import { computed, ref, watch } from 'vue';

const props = defineProps<{challengeId: OverflowChallenge}>()

const visible = computed(()=>ui.value.challenge.overflow[props.challengeId].visible)
const completed = computed(()=>ui.value.challenge.overflow[props.challengeId].completed);
const running = computed(()=>ui.value.currentChallenge.overflow===props.challengeId)
const challengeName = challengeConstObj[props.challengeId].name
const challengeModifier = texts['en-US'].challenges.overflow[props.challengeId].modifier;

const enterChallengeButtonClass = computed(()=>{return {"c-challenge-box-enter-button-not-completed": !completed.value, "c-challenge-box-enter-button-completed": completed.value}});

const challengeGoal = ref(CurrencyName.matter as string);
const updateChallengeGoal = ()=>challengeGoal.value=formatValue(challengeConstObj[props.challengeId].goal,player.notationId)+" "+CurrencyName.matter;
updateChallengeGoal();

watch(()=>ui.value.notationId,updateChallengeGoal);



const challengeReward = texts['en-US'].challenges.overflow[props.challengeId].reward;
</script>
<template>
  <div class="c-challenge-box" v-show="visible">
    <p class="c-challenge-box-name">{{ challengeName }}</p>
    <p>Modifier: {{ challengeModifier }}</p>
    <p>Goal: {{ challengeGoal }}</p>
    <p>Reward: {{ challengeReward }}</p>
    <button @click="inputFunctions.ClickEnterChallenge(props.challengeId)" :class="enterChallengeButtonClass">{{running ? "Running" : completed ? "Completed" : "Start"}}</button>
  </div>
</template>
<style>
.c-challenge-box{
  width: 500px;
  min-height: 150px;
  border: 1px solid black;
}
.c-challenge-box-name{
  width: 100%;
  text-align: center;
}
.c-challenge-box-enter-button-not-completed{

}
.c-challenge-box-enter-button-completed{

}
</style>