<template lang="pug">
//- 直撥倒數計時卡片
#CountdownCard
  .countdown-layout
    .card-item
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
    .ctrl-bar
      aButton(size="small" type="primary" @click="RefStart")
        CaretRightOutlined
      aButton(size="small" type="primary" @click="RefPause")
        PauseOutlined
      aButton(size="small" type="primary" @click="RefInit")
        UndoOutlined
</template>

<script setup>
import { CaretRightOutlined, PauseOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { ref, computed, onMounted, onUnmounted } from "vue";

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  countdownSecond: {
    type: Number,
    default: 0
  }
});
const emit = defineEmits(["on-complete"]);
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const second = ref(3);
const m1 = ref(0);
const m0 = ref(0);
const s1 = ref(0);
const s0 = ref(0);

let timeInterval = null;
let isPause = false;
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 顯示分鐘模組
const showMinute = computed(() => props.countdownSecond >= 60);
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
  isPause = false;
};
// 開始
const RefStart = () => {
  if (!timeInterval) CreateInterval();
  isPause = false;
};
// 暫停
const RefPause = () => {
  isPause = true;
};
defineExpose({ RefInit, RefStart, RefPause });
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 完成
const EmitComplete = () => {
  emit("on-complete");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開始循環
const CreateInterval = () => {
  timeInterval = setInterval(() => {
    if (!isPause) {
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
  if (second.value === 0) {
    DeleteInterval();
    EmitComplete();
    return;
  }
  second.value--;
  UpdateCountdownNum();
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
  display: flex;
  .countdown-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
}
// 組件
#CountdownCard {
  .card-item {
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    font-size: 50px;
    font-weight: bold;
    line-height: 50px;
    color: white;
    background-color: #76838a;
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
