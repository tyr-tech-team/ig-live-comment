<template lang="pug">
//- 直播倒數計時卡片a
#CountdownCard
  .countdown-layout
    .slogan {{ sloganText }}
    
    .time-area
      .time-box(:class="{'urgent': isUrgent}")
        .pause(v-show="isPause") {{ "暫停" }}
        .num-box(v-show="showMinute")
          transition-group(name="slide-up")
            .num(v-for="n of 10" :key="n" v-show="m0===n-1") {{n-1}}
        .num-box(v-show="showMinute")
          transition-group(name="slide-up")
            .num(v-for="n of 10" :key="n" v-show="m1===n-1") {{n-1}}
        .colon(v-show="showMinute") {{":"}}
        .num-box
          transition-group(name="slide-up")
            .num(v-for="n of 10" :key="n" v-show="s0===n-1") {{n-1}}
        .num-box
          transition-group(name="slide-up")
            .num(v-for="n of 10" :key="n" v-show="s1===n-1") {{n-1}}
    //- .ctrl-bar
    //-   aButton(size="small" type="primary" @click="RefStart")
    //-     CaretRightOutlined
    //-   aButton(size="small" type="primary" @click="RefPause")
    //-     PauseOutlined
    //-   aButton(size="small" type="primary" @click="RefInit")
    //-     UndoOutlined
</template>

<script setup>
import { CaretRightOutlined, PauseOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { ref, computed, onMounted, onUnmounted } from "vue";

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  countdownSecond: { // 倒數秒數
    type: Number,
    default: 0
  },
  sloganText: { // 口號
    type: String,
    default: ""
  },
  urgentSec: {
    type: Number,
    default: 59
  }
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const second = ref(0);
const m1 = ref(0);
const m0 = ref(0);
const s1 = ref(0);
const s0 = ref(0);
const isPause = ref(false);

let timeInterval = null;
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 顯示分鐘模組
const showMinute = computed(() => second.value >= 60); // 60 秒內不呈現分鐘
const isUrgent = computed(() => second.value <= props.urgentSec); // 60 秒內不呈現分鐘
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
onMounted(()=>{
  RefInit();
});
onUnmounted(()=>{
  DeleteInterval();
});
// Ref Init ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 初始化
const RefInit = () => {
  DeleteInterval();
  second.value = props.countdownSecond;
  UpdateCountdownNum();
  isPause.value = false;
};
// 開始
const RefStart = () => {
  if (!timeInterval) CreateInterval();
  isPause.value = false;
};
// 暫停
const RefPause = () => {
  isPause.value = true;
};
defineExpose({ RefInit, RefStart, RefPause });
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-complete", "on-first-start"]);
// 初次開始
const EmitFirstStart = () => {
  emit("on-first-start");
};
// 完成
const EmitComplete = () => {
  emit("on-complete");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開始循環
const CreateInterval = () => {
  EmitFirstStart();
  if (second.value <= 0) {
    DeleteInterval();
    EmitComplete();
    return;
  }
  timeInterval = setInterval(() => {
    if (!isPause.value) {
      ReduceSecond();
    }
  },1000);
};

// 銷毀循環
const DeleteInterval = () => {
  if(timeInterval) clearInterval(timeInterval);
  timeInterval = null;
};

// 減少秒數
const ReduceSecond = () => {
  second.value--;
  if (second.value >= 0) {
    // 更新畫面
    UpdateCountdownNum();
  }
  if (second.value <= 0) {
    DeleteInterval();
    EmitComplete();
    return;
  }
};

// 更新倒數數值
const UpdateCountdownNum = () => {
  const m = `${parseInt(second.value / 60)}`.padStart(2,"0");
  const s = `${second.value % 60}`.padStart(2,"0");
  m1.value = Number(m[1]);
  m0.value = Number(m[0]);
  s1.value = Number(s[1]);
  s0.value = Number(s[0]);
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
</script>

<style lang="scss" scoped>
// 佈局
#CountdownCard {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 5px 10px 10px 10px;
  border-radius: 4px;;
  .countdown-layout {
    gap: 5px;
    .time-area {
      display: flex;
      justify-content: center;
    }
  }
}
// 組件
#CountdownCard {
  .slogan {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 2px;
    letter-spacing: 2px;;
    color: #3a4c59;
  }
  .pause {
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    top: 0;
    background-color: #7A8994D7;
    font-size: 14px;
    line-height: 15px;
    font-weight: 400;
    letter-spacing: 20px;
    padding-left: 20px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white
  }.time-area
  .time-box {
    overflow: hidden;
    position: relative;
    padding: 15px 10px;
    border-radius: 5px;
    display: flex;
    font-size: 50px;
    font-weight: bold;
    line-height: 50px;
    color: #3a4c59;
    background-color: #E0E6EA;
    .colon {
      text-align: center;
      transform: translateY(-3px);
      width: 20px;
    }
    .num-box {
      position:relative;
      width: 35px;
      height: 50px;
      .num {
        position: absolute;
        text-align: center;
      }
    }
  }
  .ctrl-bar {
    display: flex;
    gap: 5px;
  }
  .urgent {
    background-color: #FFD1D1 !important;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50%);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
