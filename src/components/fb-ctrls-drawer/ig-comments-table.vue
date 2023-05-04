<template lang="pug">
//- 請填寫功能描述👈
#IgCommentsTable(ref="El_IgCommentsTable")
  .table-row.table-header
    p {{"時間"}}
    p {{"使用者"}}
    p {{"內容"}}
  .table-row(v-for="commentItem of commentList" :key="commentItem.id")
    p {{commentItem.createTime}}
    p {{commentItem.userName}}
    p {{commentItem.text}}
  .no-data(v-show="commentList.length===0")
    p {{"NO DATA"}}
.btn    
  aButton(size="small" type="primary" @click="DownloadCsv") {{"Download CSV"}}
</template>

<script setup>
import { getCurrentInstance, nextTick, ref, onMounted, watch} from "vue";
const props = defineProps({
  commentList: {
    type: Array,
    default: ()=> ([])
  }
});
const {proxy: {$moment}} = getCurrentInstance();
const El_IgCommentsTable = ref(null);
onMounted(() => {
  TableScrollBottom();
});
watch(
  () => props.commentList,
  () => {
    TableScrollBottom();
  },
  {deep: true}
);
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 滑至最底
const TableScrollBottom = () => {
  nextTick(() => {
    const el = El_IgCommentsTable.value;
    el.scrollTop = el.scrollHeight;
  });
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 下載成CSV
const DownloadCsv = () => {
  const csvContent = "data:text/csv;charset=utf-8,"+
    "留言時間,使用者名稱,留言內容,使用者 ID\r\n"+
    props.commentList.map((e) => `${e.createTime},${e.userName},${e.text},${e.userId}`).join("\r\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const now = $moment().format("YYYYMMDD_HH_mm_ss");
  link.setAttribute("download", `${now}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

</script>

<style lang="scss" scoped>
// 佈局
#IgCommentsTable {
  margin-top: 10px;
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
.btn {
  margin-top: 10px;
}
</style>
