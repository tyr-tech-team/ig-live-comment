<template lang="pug">
//- 直播倒數計時
#LiveCountdown
  .time-ctrl
    .time-card
      .time-set
        .time-label {{"預備備倒數設定："}}
        .row-item
          aInputNumber(v-model:value="prepareM" :disabled="isLock" :max="60" :min="0" style="width: 60px")
          .colon {{":"}}
          aInputNumber(v-model:value="prepareS" :disabled="isLock" :max="59" :min="0" style="width: 60px")
      .time-set
        .time-label {{"先搶先贏倒數設定："}}
        .row-item
          aInputNumber(v-model:value="countdownM" :disabled="isLock" :max="60" :min="0" style="width: 60px")
          .colon {{":"}}
          aInputNumber(v-model:value="countdownS" :disabled="isLock" :max="59" :min="0" style="width: 60px")
    .row-item
      aButton(@click="ClickStart")
        CaretRightOutlined
      aButton(@click="ClickPause")
        PauseOutlined
      aButton(@click="ClickReset")
        UndoOutlined
  .row-item
    CountdownCard(
      v-show="!isPrepareComplete"
      :key="'CountdownCard1'"
      ref="CountdownCard1"
      sloganText="預備備！"
      :countdownSecond="prepareSecond"
      :urgentSec="10"
      :endSec="1"
      @on-first-start="OnPrepareStart"
      @on-complete="OnPrepareComplete"
    )
    CountdownCard(
      v-show="isPrepareComplete"
      :key="'CountdownCard2'"
      ref="CountdownCard2"
      sloganText="開始！先搶先贏！"
      :countdownSecond="countdownSecond"
      @on-complete="OnCountdownComplete"
    )
</template>

<script setup>
import { CaretRightOutlined, PauseOutlined, UndoOutlined } from "@ant-design/icons-vue";
import CountdownCard from "./countdown-card.vue";
import { ref, nextTick } from "vue";

const CountdownCard1 = ref(null);
const CountdownCard2 = ref(null);

const prepareM = ref(0); // 1
const prepareS = ref(2);
const countdownM = ref(0); // 2
const countdownS = ref(2);
const prepareSecond = ref(0);
const countdownSecond = ref(0);

const isPrepareComplete = ref(false);
const isCountdownComplete = ref(false);
const isLock = ref(false);

const uuid = ref("");
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-create", "on-start", "on-complete", "on-cancel"]);
//  新增
const EmitCreate = () => {
  emit("on-create", uuid.value);
};

// 開始
const EmitStart = () => {
  emit("on-start", uuid.value);
};

// 完成
const EmitComplete = () => {
  emit("on-complete", uuid.value);
};

// 取消
const EmitCancel = () => {
  emit("on-cancel", uuid.value);
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 倒數計時初始化
const InitCountdown = () => {
  if (!isLock.value) {
    isPrepareComplete.value = false;
    isCountdownComplete.value = false;
  }
  prepareSecond.value = (prepareM.value * 60) + prepareS.value;
  countdownSecond.value = (countdownM.value * 60) + countdownS.value;
  nextTick(() => {
    PrepareSet();
    CountdownSet();
  });
};

// 預備備設定
const PrepareSet =  () => {
  prepareSecond.value = (prepareM.value * 60) + prepareS.value;
  CountdownCard1.value.RefInit();
};

// 先搶先贏設定
const CountdownSet =  () => {
  countdownSecond.value = (countdownM.value * 60) + countdownS.value;
  CountdownCard2.value.RefInit();
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開始
const ClickStart = () => {
  // 尚未進行
  if (!isLock.value) {
    InitCountdown();
    isLock.value = true;
  }
  // 預備備 未完成
  if (!isPrepareComplete.value) {
    setTimeout(() => {
      CountdownCard1.value.RefStart();
    }, 200);
    return;
  }
  // 預備備 完成
  setTimeout(() => {
    CountdownCard2.value.RefStart();
  }, 200);
};

// 暫停
const ClickPause = () => {
  // 預備備 未完成
  if (!isPrepareComplete.value) {
    CountdownCard1.value.RefPause();
    return;
  }
  // 預備備 完成
  CountdownCard2.value.RefPause();
};

// 恢復
const ClickReset = () => {
  if (uuid.value) {
    EmitCancel();
    uuid.value = "";
  }
  isLock.value = false;
  InitCountdown();
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 預備備第一次開始 
const OnPrepareStart = () => {
  uuid.value = CreateUUID();
  EmitCreate();
};
// 預備備 完成
const OnPrepareComplete = () => {
  isPrepareComplete.value = true;
  nextTick(() => {
    EmitStart();
    CountdownCard2.value.RefStart();
  });
}; 

// 先搶先贏 完成
const OnCountdownComplete = () => {
  EmitComplete();
  uuid.value = "";
  isCountdownComplete.value = true;
  isLock.value = false;
};

// 生成唯一ID
const CreateUUID = () => {
  let d = Date.now();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
InitCountdown();
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
    align-items: center;
    gap: 10px;
  }
  .colon {
    font-size: 20px;
  }
  .time-ctrl {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: #D4DDDF;
    border-radius: 4px;
  }
  .time-card {
    padding: 10px 15px;
    border-radius: 4px;;
    background-color: white;
    color: #444;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .time-set {
      .time-label {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
