<template lang="pug">
//- 請填寫功能描述👈
#ProductCard
  .ctrl-area
    .delete-btn(@click="AskDelete")
      p {{"X"}}
    .row-item
      p {{"商品名稱："}}
      aInput(v-model:value="props.productInfo.name" style="width: 500px" size="small")
    .row-item
      p {{"起標金額："}}
      aInputNumber(
        v-model:value="props.productInfo.basicPrice"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        style="width: 110px"
        size="small"
      )
      p.left-gap {{"金額間距："}}
      aInputNumber(
        v-model:value="props.productInfo.increase"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="500"
        style="width: 80px"
        size="small"
      )
      p.left-gap {{"最高金額："}}
      aInputNumber(
        v-model:value="props.productInfo.TopPrice"
        :max="10000000" :min="props.productInfo.basicPrice + props.productInfo.increase"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="500"
        style="width: 110px"
        size="small"
      )
    .row-item
      p
        span {{ `開始時間：` }}
        span.time-box(v-show="props.productInfo.startAt") {{ NumToDay(props.productInfo.startAt,'HH:mm:ss')}}
      p.left-gap
        span {{ `結束時間：` }}
        span.time-box(v-show="props.productInfo.endAt") {{ NumToDay(props.productInfo.endAt,'HH:mm:ss')}}
  .level-area
    //- // TODO
    pre {{ commentNumList }}
    //- .table
      .table-row.table-header
        p {{"時間"}}
        p {{"使用者"}}
        p {{"金額"}}
        p {{"內容"}}
      .table-row(v-for="commentItem of levelTableList" :key="commentItem.id")
        p {{commentItem.createTime}}
        p {{commentItem.userName}}
        p {{`NT$${FormatNumber((commentItem.index* props.cardInfo.increase) + props.cardInfo.basicPrice)}`}}
        p {{commentItem.text}}
      .no-data(v-show="levelTableList.length===0")
        p {{"NO DATA"}}
</template>

<script setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal, notification } from "ant-design-vue";
import { ref, createVNode, computed, getCurrentInstance } from "vue";

const props = defineProps({
  productInfo: { // 商品資訊
    type: Object,
    default: () => ({})
  },
  commentNumList: { // 留言列表
    type: Array,
    default: () => ([])
  },
  colseDisabled: { // 禁止刪除
    type: Boolean,
    default: false
  }
});
const {proxy: {$fb, $moment}} = getCurrentInstance();
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-delete"]);
const EmitDelete = () => {
  emit("on-delete");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 刪除詢問
const AskDelete = async() => {
  if (props.colseDisabled) {
    notification.error({ message: "商品正在使用，無法刪除" });
    return;
  }
  const isOk = await new Promise((resolve) =>
    Modal.confirm({
      title: "刪除確認",
      icon: createVNode(ExclamationCircleOutlined),
      content: "確定要刪除嗎？",
      okText: "刪除",
      cancelText: "取消",
      onOk() {resolve(true);},
      onCancel() {resolve(false);},
    })
  );
  if (isOk) {
    EmitDelete();
  }
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
// 數字化（整數）
const IntStyle = (num, max = 9999999999999) => {
  let _num = Number(num);
  if (_num > max) _num = max;
  const parts = _num.toString().split(".");
  return parts[0] && Number(parts[0]) >= 0 ? parts[0] : "0";
};
// 日期 轉 時間戳記
const DayToNum = (val) => $moment(val).unix();
const NumToDay = (val, format = "YYYY/MM/DD HH:mm:ss") => $moment.unix(val).utcOffset(8).format(format);
const Rfc3339ToDay = (date, format = "YYYY/MM/DD") => {
  if (!date) return "";
  return $moment(date).format(format);
};
const DayToRfc3339 = (rfc) => $moment(rfc).format();
</script>

<style lang="scss" scoped>
// 佈局
#ProductCard {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 2px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "ctrl"
    "level";
  .ctrl-area {
    grid-area: ctrl;
    background: #E0E6EA;
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
#ProductCard {
  .left-gap {
    padding-left: 20px;
  }
  .delete-btn {
    position: absolute;
    right: 5px;
    top: 0px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    &:active {
      transform: scale(0.9);
    }
  }
  .row-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .time-box {
    background-color: #FFFDE8;
    padding: 1px 10px;
    border-radius: 4px;
  }

  .table {
    max-height: 400px;
    position: relative;
    overflow: auto;
    border: 1px solid #ccc;
    box-sizing: border-box;
    .table-header {
      position: sticky;
      top: 0;
      background: #EFF1F1;
    }
    .table-row {
      display: grid;
      grid-template-columns: 105px 120px 1fr;
      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
      // gap: 5px;
      p {
        font-weight: 400;
        font-size: 12px;;
        padding: 2px 5px;
        word-break: break-all;
        white-space: pre-wrap;
        word-wrap: break-word;
        box-sizing: border-box;
        &:not(:last-child) {
          border-right: 1px solid #ccc;
        }
      }
    }

    .no-data {
      text-align: center;
      padding: 10px;
    }
  }
}
</style>
