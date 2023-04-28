<template lang="pug">
//- 搶購倒數卡片
#SnapUpCard
  .ctrl-area
    .delete-btn(@click="AskDelete")
      p {{"X"}}
    .row-item
      p {{"商品名稱："}}
      aInput(v-model:value="props.cardInfo.name" style="width: 450px")
    .row-item
      p {{"基礎金額："}}
      aInputNumber(
        v-model:value="props.cardInfo.basicPrice"
        addon-before="NT$"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        style="width: 180px"
      )
      p.left-gap {{"+1金額："}}
      aInputNumber(
        v-model:value="props.cardInfo.increase"
        addon-before="NT$"
        :max="10000000" :min="0"
        :formatter="value => FormatNumber(`${value}`)"
        :parser="value => IntStyle(value.replace(/$s?|(,*)/g, ''))"
        :step="500"
        style="width: 180px"
      )
    .row-item
      p
        span {{ `開始時間：` }}
        span(v-show="props.cardInfo.startAt") {{ NumToDay(props.cardInfo.startAt,'HH:mm:ss')}}
      p.left-gap
        span {{ `結束時間：` }}
        span(v-show="props.cardInfo.endAt") {{ NumToDay(props.cardInfo.endAt,'HH:mm:ss')}}
  .level-area
    .table
      .table-row.table-header
        p {{"Time"}}
        p {{"User"}}
        p {{"money"}}
      .table-row(v-for="commentItem of levelTableList" :key="commentItem.id")
        p {{commentItem.createTime}}
        p {{commentItem.userName}}
        p {{`NT$${FormatNumber((commentItem.index* props.cardInfo.increase) + props.cardInfo.basicPrice)}`}}
      .no-data(v-show="levelTableList.length===0")
        p {{"NO DATA"}}
    //- pre {{ props.cardInfo }}
    //- pre {{ inTimeRangeCommentList }}
</template>

<script setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { ref, createVNode, computed,getCurrentInstance } from "vue";

const props = defineProps({
  cardInfo: {
    type: Object,
    default: () => ({})
  },
  add1CommentList: {
    type: Array,
    default: () => ([])
  }
});
const {proxy: {$fb, $moment}} = getCurrentInstance();
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const cardItemName = ref(props.cardInfo.name);
const itemIncrease = ref(props.cardInfo.increase);
const cardItemBasePrice = ref(props.cardInfo.basicPrice);
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-delete"]);
// 取消
const EmitDelete = () => {
  emit("on-delete");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const AskDelete = async() => {
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

// 在時間區間內的訊息
const inTimeRangeCommentList = computed(() => {
  const _list = props.add1CommentList.filter((comment) => {
    const {timestamp} = comment;
    // 開始時間不存在
    if (!props.cardInfo.startAt) return false;
    // 小於開始時間
    if (timestamp < props.cardInfo.startAt) return false; 
    // 結束時間不存在
    if (!props.cardInfo.endAt) return true;
    // 大於開始時間
    if (timestamp > props.cardInfo.endAt) return false;
    return true; 
  });
  return _list.map((item,index) => {
    return {
      ...item,
      index: _list.length - index
    };
  });
});
// 排行表
const levelTableList =  computed(() => {
  const _arr = [];
  for (const commentInfo of inTimeRangeCommentList.value) {
    const findIndex = _arr.findIndex((i) => i.userId === commentInfo.userId);
    if (findIndex>=0) continue;
    _arr.push(commentInfo);
  }
  return _arr;
});
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
#SnapUpCard {
  position: relative;
  border-radius: 5px;
  border: 1px solid #D4D4D4;
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
  .delete-btn {
    position: absolute;
    right: 10px;
    top: 0px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    &:active {
      transform: scale(0.9);
    }
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
