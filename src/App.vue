<template lang="pug">
//- 請填寫功能描述👈
#Home
  .row-area
    .btn-basic(@click="ClickStatusBtn") {{"狀態"}}
    .btn-basic(@click="ClickAuthorizationBtn") {{"授權"}}
    .btn-basic(@click="ClickFreedBtn") {{"釋放"}}
    .btn-basic(@click="ClickInfoBtn") {{"資訊"}}
    .btn-basic(@click="ClickReAuthorizationBtn") {{"重新授權"}}
  .row-area
    .btn-basic(@click="ClickFbPageListBtn") {{"取得粉專列表"}}
  .row-area
    select
  pre {{ fbRes.res }}
  pre {{ pageList }}
</template>

<script setup>
import { inject, reactive, ref } from "vue";
const $fb = inject("$fb");
// ------------------------------------------------------------------
const fbRes = reactive({res: null});
let pageList = reactive([]);
let pageId = ref("");
// ------------------------------------------------------------------
// 取得狀態
const ClickStatusBtn = async () => fbRes.res = await $fb.Status();
// 取得授權
const ClickAuthorizationBtn = async() => fbRes.res = await $fb.Authorization();
// 取得會員資訊
const ClickInfoBtn = async() => fbRes.res = await $fb.Info();
//  取得重新授權按鈕
const ClickReAuthorizationBtn = async() => fbRes.res = await $fb.Authorization();
// ------------------------------------------------------------------
//  取得粉專列表
const ClickFbPageListBtn = async() => {
  fbRes.res = await $fb.FbPageList();
  pageList = fbRes.res.data.map((pageItem) => {
    return {name: pageItem.name, id: pageItem.id};
  });
};
</script>

<style lang="scss" scoped>
// 佈局
#Home {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
// 組件
#Home {
  .row-area {
    display: flex;
    gap: 10px;
  }
  .btn-basic {
    padding: 5px 10px;
    border: 1 solid #666;
    border-radius: 4px;
    background: #666;
    color: white;
    cursor: pointer;
    user-select: none;
    &:after {
      transform: scale(0.98);
    }
  }
}
</style>
