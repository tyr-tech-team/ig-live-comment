<template lang="pug">
//- 請填寫功能描述👈
#ProductCard
  .ctrl-area
    .delete-btn(@click="AskDelete")
      p {{"X"}}
    .row-item
      p {{"商品名稱："}}
      aInput(
        v-model:value="props.cardInfo.name"
        style="width: 500px"
        size="small"
        @change="EmitChange"
      )
    .row-item
      p {{"起標金額："}}
      aInputNumber(
        v-model:value="cardInfo.basicPrice"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        style="width: 110px"
        size="small"
        @change="EmitChange"
      )
      p.left-gap {{"金額間距："}}
      aInputNumber(
        v-model:value="cardInfo.increase"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="500"
        style="width: 80px"
        size="small"
        @change="EmitChange"
      )
      p.left-gap {{"最高金額："}}
      aInputNumber(
        v-model:value="cardInfo.topPrice"
        :max="10000000" :min="cardInfo.basicPrice + cardInfo.increase"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="cardInfo.increase"
        style="width: 110px"
        size="small"
        @change="EmitChange"
      )
    .row-item
      p
        span {{ `開始時間：` }}
        span.time-box(v-show="countdownInfo.startAt") {{ NumToDay(countdownInfo.startAt,'HH:mm:ss')}}
      p.left-gap
        span {{ `結束時間：` }}
        span.time-box(v-show="countdownInfo.endAt") {{ NumToDay(countdownInfo.endAt,'HH:mm:ss')}}
      p.left-gap.big(v-if="winner")
        span {{ winner.isWin? `得標者 ${winner.userName}：` : `目前出價 ${winner.userName}： ` }}
        span {{ FormatNumber(winner.price)}}

  .level-area
    .table(ref="El_TableList")
      .table-row.table-header
        p {{"時間"}}
        p {{"使用者"}}
        p {{"金額"}}
        p {{"內容"}}
        p {{"使用者 ID"}}
      .table-row(v-for="commentItem of levelCommentList" :key="commentItem.id")
        p {{commentItem.createTime}}
        p.big {{commentItem.userName}}
        p.big {{FormatNumber(commentItem.price)}}
        p {{commentItem.text}}
        p {{commentItem.userId}}
      .no-data(v-show="levelCommentList.length===0")
        p {{"尚未出現有人出價"}}
</template>

<script setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal, notification } from "ant-design-vue";
import { ref, createVNode, computed, getCurrentInstance, nextTick, registerRuntimeCompiler } from "vue";

const props = defineProps({
  cardInfo: { // 商品資訊
    type: Object,
    default: () => ({})
  },
  countdownInfo: {
    type:Object,
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

const El_TableList = ref(null);
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 在時間區間內的訊息
const inTimeRangeCommentList = computed(() => {
  const { basicPrice, increase, topPrice } = props.cardInfo;
  let nextPrice = basicPrice + increase;
  return props.commentNumList.filter((comment) => {
    const {timestamp} = comment;
    // 開始時間不存在
    if (!props.countdownInfo?.startAt) return false;
    // 小於開始時間
    if (timestamp < props.countdownInfo?.startAt) return false; 
    // 結束時間不存在
    if (!props.countdownInfo?.endAt) return true;
    // 大於開始時間
    if (timestamp > props.countdownInfo?.endAt) return false;
    return true; 
  });
});

// 按出價階級的訊息
const levelCommentList = computed(() => {
  const _arr = [];
  const { basicPrice, increase, topPrice } = props.cardInfo;
  let nextPrice = basicPrice + increase;
  for (const m of inTimeRangeCommentList.value) {
    // 暫時得標金額
    const okPrice = m.nums.filter((i) => i <= topPrice && i === nextPrice); // 不超過最大金額，等於預計金額
    if (okPrice.length > 0) {
      _arr.push({ ...m, price: nextPrice});
      nextPrice += increase;
    }
  }
  return _arr;
});

const winner = computed( () => {
  UpdateWinner();
  if (levelCommentList.value.length === 0) return null;
  const _winner = levelCommentList.value[levelCommentList.value.length - 1];
  if (!_winner) return null;
  let isWin = _winner.price === props.cardInfo.topPrice || !!props.countdownInfo?.endAt;
  return {..._winner, isWin};
});

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-delete", "on-change"]);
// 刪除事件
const EmitDelete = () => {
  emit("on-delete");
};

// 變更事件
const EmitChange = () => {
  emit("on-change");
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
const UpdateWinner  = () =>  {
  if (props.cardInfo.winner === winner.value) return;
  if (
    winner.value && winner.value &&
    props.cardInfo.winner?.id === winner.value?.id &&
    props.cardInfo.winner?.isWin === winner.value?.isWin
  ) return;
  nextTick( () => {
    console.log("Update winner");
    TableScrollBottom();
    props.cardInfo.winner = winner.value;
    EmitChange();
  });
};

// 滑至最底
const TableScrollBottom = () => {
  nextTick(() => {
    const el = El_TableList.value;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });
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
    background: #E4EAEE;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .level-area {
    padding: 1px;
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
      grid-template-columns: 105px 140px 100px 1fr 140px;
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
.big {
  font-weight: 900 !important;
  font-size: 14px !important;
  color: #48434E;
}
</style>
