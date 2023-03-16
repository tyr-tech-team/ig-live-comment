<template lang="pug">
//- 搶購倒數卡片
#SnapUpCard
  .ctrl-area 
    .row-item
      p {{"商品名稱："}}
      aInput(v-model:value="props.cardInfo.value.name" style="width: 450px")
    .row-item
      p {{"基礎金額："}}
      aInputNumber(
        v-model:value="props.cardInfo.value.basicPrice"
        addon-before="NT$"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        style="width: 180px"
      )
      p.left-gap {{"+1金額："}}
      aInputNumber(
        v-model:value="props.cardInfo.value.increase"
        addon-before="NT$"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="500"
        style="width: 180px"
      )
    .row-item
      p {{ `開始時間：${props.cardInfo.value.startAt}` }}
      p.left-gap {{ `結束時間：${$props.cardInfo.value.endAt}` }}
  .level-area
    pre {{ props.cardInfo }}
    pre {{ commentList }}
</template>

<script setup>
import { ref, computed, nextTick, reactive, getCurrentInstance } from "vue";

const props = defineProps({
  cardInfo: {
    type: Object,
    default: () => ({})
  },
  commentList: {
    type: Array,
    default: () => ([])
  }
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const cardItemName = ref(props.cardInfo.name);
const itemIncrease = ref(props.cardInfo.increase);
const cardItemBasePrice = ref(props.cardInfo.basicPrice);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const ChangeName = (el) => {
  // props.cardInfo.name = el.target.value;
  const update = getCurrentInstance();
  // update.proxy.$forceUpdate();
  setTimeout(() => {
    console.log("change", el, props.cardInfo);
  }, 100);
}; 
// 格式金錢化，三位一點
const FormatNumber = (num, max = 999999999999999) => {
  let _num = Number(num).toString();
  if (_num > max) _num = max;
  const parts = _num.split(".");
  parts[0] = `${parts[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 設數字３位','
  return parts.join(".");
};
// 數字化（整數）
const IntStyle = (num, max = 9999999999999) => {
  let _num = Number(num);
  if (_num > max) _num = max;
  const parts = _num.toString().split(".");
  return parts[0] && Number(parts[0]) >= 0 ? parts[0] : "0";
};
</script>

<style lang="scss" scoped>
// 佈局
#SnapUpCard {
  border-radius: 5px;
  border: 1px solid #a1a1a1;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "ctrl"
    "level";
  .ctrl-area {
    grid-area: ctrl;
    background: #edf5ec;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .level-area {
    padding: 10px;
    background: #ffffff;
    grid-area: level;
  }
}
// 組件
#SnapUpCard {
  .left-gap {
    padding-left: 20px;
  }
  .row-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}
</style>
