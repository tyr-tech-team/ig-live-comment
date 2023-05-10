<template lang="pug">
//- 直播倒數計時
#LiveCountdown
  .time-ctrl
    .time-card
      .time-set 
        aSelect(
          v-model:value="selectProductId"
          style="width: 145px"
          allowClear
          placeholder="請選擇商品"
          :disabled="isLock" 
          @change="EmitProductChange"
        )
          aSelectOption(
            v-for="productItem of productSelectList" :key="productItem.value"
            :value="productItem.value"
          ) {{ productItem.label }}
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
  .row-item(v-if="currentProductInfo && currentProductInfo.winner")
    p.winner
      span {{ currentProductInfo.winner.isWin? `得標者 ${currentProductInfo.winner.userName}：` : `目前出價 ${currentProductInfo.winner.userName}： ` }}
      span {{ FormatNumber(currentProductInfo.winner.price)}}
</template>

<script setup>
import { CaretRightOutlined, PauseOutlined, UndoOutlined } from "@ant-design/icons-vue";
import CountdownCard from "./countdown-card.vue";
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  productCardList: {
    type: Array,
    default: () => ([])
  },
  countdownInfoObj: {
    type: Object,
    default: () => ({})
  }
});
const CountdownCard1 = ref(null);
const CountdownCard2 = ref(null);

const selectProductId = ref("");
const prepareM = ref(1); // 1
const prepareS = ref(0);
const countdownM = ref(2); // 2
const countdownS = ref(0);
const prepareSecond = ref(0);
const countdownSecond = ref(0);

const isPrepareComplete = ref(false);
const isCountdownComplete = ref(false);
const isLock = ref(false);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const productSelectList = computed(() => {
  return props.productCardList
    .map((p)=> {
      return {
        label: p.name || "(未設定)",
        value: p.uuid
      };
    });
});
const currentProductInfo = computed(() => {
  if (!selectProductId.value) return null;
  return props.productCardList.find((i) => i.uuid === selectProductId.value) || null;
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-product-change", "on-save",]);
// 選擇商品變動
const EmitProductChange = () => {
  emit("on-product-change", selectProductId.value);
};
const EmitSave = () => {
  emit("on-save");
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
  isLock.value = false;
  InitCountdown();
  EmitSave();
};


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 預備備第一次開始 
const OnPrepareStart = () => {
  ResetProductTime();
};
// 預備備 完成
const OnPrepareComplete = () => {
  isPrepareComplete.value = true;
  nextTick(() => {
    ResetProductTime();
    SetProductStartAt();
    CountdownCard2.value.RefStart();
  });
}; 

// 先搶先贏 完成
const OnCountdownComplete = () => {
  SetProdcutEndAt();
  isCountdownComplete.value = true;
  isLock.value = false;
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 初始時間
const ResetProductTime = () => {
  // if (!currentProductInfo.value) return;
  if (!selectProductId.value) return;
  if (!props.countdownInfoObj[selectProductId.value]) {
    props.countdownInfoObj[selectProductId.value] = {
      startAt: "",
      endAt: ""
    };
  }
  props.countdownInfoObj[selectProductId.value].startAt = "";
  props.countdownInfoObj[selectProductId.value].endAt = "";
  EmitSave();
};
// 設定商品開始時間
const SetProductStartAt = () => {
  if (!props.countdownInfoObj[selectProductId.value]) {
    props.countdownInfoObj[selectProductId.value] = {
      startAt: "",
      endAt: ""
    };
  }
  props.countdownInfoObj[selectProductId.value].startAt = (new Date().valueOf()/1000)^0;
  EmitSave();
};
// 設定商品結束時間
const SetProdcutEndAt = () => {
  console.log("end", props.countdownInfoObj?.[selectProductId.value]);
  if (!props.countdownInfoObj?.[selectProductId.value]) return;
  props.countdownInfoObj[selectProductId.value].endAt = (new Date().valueOf()/1000)^0;
  console.log("endset", props.countdownInfoObj?.[selectProductId.value]);
  currentProductInfo.value.isComplete = true;  EmitSave();
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 格式金錢化，三位一點
const FormatNumber = (num, max = 999999999999999) => {
  let _num = Number(num).toString();
  if (_num > max) _num = max;
  const parts = _num.split(".");
  parts[0] = `${parts[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 設數字３位','
  return parts.join(".");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

InitCountdown();
</script>

<style lang="scss" scoped>

// 佈局
#LiveCountdown {

}
// 組件
#LiveCountdown {
  .row-item {
    padding: 2px 0;
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
  .winner {
    font-weight: 900;
    font-size: 14px;
    color: #4F67AF;
  }
}
</style>
