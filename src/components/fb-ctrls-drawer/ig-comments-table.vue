<template lang="pug">
//- 請填寫功能描述👈
#IgCommentsTable
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
</template>

<script setup>
const props = defineProps({
  commentList: {
    type: Array,
    default: ()=> ([])
  }
});
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
</style>
