<template lang="pug">
//- 直撥倒數計時
#LiveCountdown
  .row-item
    aInputNumber(v-model:value="prepareM" addon-after="分" :max="60" :min="0" style="width: 100px")
    aInputNumber(v-model:value="prepareS" addon-after="秒" :max="60" :min="0" style="width: 100px")
    aButton(@click="PrepareSet") {{"預備設定"}}
  .row-item
    aInputNumber(v-model:value="countdownM" addon-after="分" :max="60" :min="0" style="width: 100px")
    aInputNumber(v-model:value="countdownS" addon-after="秒" :max="60" :min="0" style="width: 100px")
    aButton(@click="CountdownSet") {{"倒數設定"}}
  .row-item
    CountdownCard(ref="CountdownCard1" :countdownSecond="prepareSecond")
    CountdownCard(ref="CountdownCard2" :countdownSecond="countdownSecond")
</template>

<script setup>
import CountdownCard from "./countdown-card.vue";
import { ref, nextTick } from "vue";

const CountdownCard1 = ref(null);
const CountdownCard2 = ref(null);

const prepareM = ref(0);
const prepareS = ref(0);
const countdownM = ref(0);
const countdownS = ref(0);
const prepareSecond = ref(0);
const countdownSecond = ref(0);

const PrepareSet =  () => {
  prepareSecond.value = (prepareM.value * 60) + prepareS.value;
  nextTick(() => {
    CountdownCard1.value.RefInit();
  });
};
const CountdownSet =  () => {
  countdownSecond.value = (countdownM.value * 60) + countdownS.value;
  nextTick(() => {
    CountdownCard2.value.RefInit();
  });
};
// nextTick(() => {
//   CountdownCard1.value.RefStart();
// });
</script>

<style lang="scss" scoped>

// 佈局
#LiveCountdown {
  padding: 10px 0;
}
// 組件
#LiveCountdown {
  .row-item {
    padding: 5px 0;
    display: flex;
    gap: 10px;
  }
 
}

</style>
