<template lang="pug">
//- 請填寫功能描述👈
#Home
  .row-area
    p {{"AppId："}}
    aInput(v-model:value="appId" style="width: 200px")
  .row-area
    .btn-basic(@click="ClickStatusBtn") {{"狀態"}}
    .btn-basic(@click="ClickAuthorizationBtn") {{"授權"}}
    .btn-basic(@click="ClickFreedBtn") {{"釋放"}}
    .btn-basic(@click="ClickInfoBtn") {{"資訊"}}
    .btn-basic(@click="ClickReAuthorizationBtn") {{"重新授權"}}
  .row-area
    .btn-basic(@click="ClickFbPageListBtn") {{"取得粉專列表"}}
    p {{"選擇粉專："}}
    aSelect(
      v-model:value="selectPageId"
      style="width: 200px"
      :options="pageList"
    )
  .row-area
    .btn-basic(@click="ClickIGBusinessInfoBtn") {{"取得IG商業帳戶列表"}}
    p {{`商業帳戶 ID：${selectBusinessId}`}}
  .row-area
    .btn-basic(@click="ClickIGLiveListBtn") {{"取得IG直撥列表"}}
    p {{"直撥列表："}}
    aSelect(
      v-model:value="selectLiveMediaId"
      style="width: 200px"
      :options="liveList"
    )
  .row-area
    .btn-basic(@click="ClickIGLiveCommentsBtn") {{"取得IG直撥留言"}}
  .row-area
    .comment-list
      .comment-item
        p {{"留言時間"}}
        p {{"姓名"}}
        p {{"使用者ID"}}
        p {{"留言內容"}}
      .comment-item(v-for="commentItem of commentList" :key="commentItem.id")
        p {{ commentItem.timestamp }}
        p {{ commentItem.username }}
        p {{ commentItem.user.id }}
        .text {{ commentItem.text }}
    //- pre {{ commentList }}
  //- pre {{ fbRes.res }}
  //- pre {{ pageList }}
  //- pre {{ selectPageId }}
</template>

<script setup>
import { inject, reactive, ref } from "vue";
const $fb = inject("$fb");
// ------------------------------------------------------------------
const fbRes = ref({res: null});
let appId = ref("1105528194174599");
// ------------------------------------------------------------------
let pageList = ref([]);
let selectPageId = ref("");
// ------------------------------------------------------------------
let selectBusinessId = ref("");
// ------------------------------------------------------------------
let liveList = ref([]);
let selectLiveMediaId = ref("");
// ------------------------------------------------------------------
let commentList = ref([]);
// ------------------------------------------------------------------
// 取得狀態
const ClickStatusBtn = async () => fbRes.value.res = await $fb.Status(appId.value);
// 取得授權
const ClickAuthorizationBtn = async() => fbRes.value.res = await $fb.Authorization(appId.value);
// 釋放
const ClickFreedBtn = async() => fbRes.value.res = await $fb.Freed(appId.value);
// 取得會員資訊
const ClickInfoBtn = async() => fbRes.value.res = await $fb.Info(appId.value);
//  取得重新授權按鈕
const ClickReAuthorizationBtn = async() => fbRes.value.res = await $fb.Authorization(appId.value);
// ------------------------------------------------------------------
//  取得粉專列表
const ClickFbPageListBtn = async() => {
  fbRes.value.res = await $fb.FbPageList();
  pageList.value = fbRes.value.res.data.data.map((item) => {
    return {label: item.name, value: item.id};
  });
  console.log("pageList", pageList);
};

//  取得IG商業帳戶
const ClickIGBusinessInfoBtn = async() => {
  if (!selectPageId.value) return;
  fbRes.value.res = await $fb.IGBusinessInfo(selectPageId.value);
  selectBusinessId.value = fbRes.value.res.data.instagram_business_account.id;

};

//  取得直撥列表
const ClickIGLiveListBtn = async() => {
  if (!selectBusinessId.value) return;
  fbRes.value.res = await $fb.IGLiveList(selectBusinessId.value);
  liveList.value = fbRes.value.res.data.data.map((item, index) => {
    return {label: `${index}直撥`, value: item.id };
  });
};

//  取得直撥留言
const ClickIGLiveCommentsBtn = async() => {
  console.log(1);
  if (!selectLiveMediaId.value) return;
  console.log(2);
  fbRes.value.res = await $fb.IGLiveComments(selectLiveMediaId.value);
  commentList.value = fbRes.value.res.data.data;
};
</script>

<style lang="scss" scoped>
// 佈局
#Home {
}
// 組件
#Home {
  p {
    margin: 0;
  }
  .row-area {
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #ccc;
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
  .comment-list {
    width: 100%;
    max-height: 500px;
    overflow: auto;
    .comment-item {
      width: 100%;
      padding: 5px;
      display: grid;
      grid-template-columns: 200px 80px 160px 1fr;
      border: 1px solid #eee;
      gap: 5px;
      .text {
        word-break: break-all;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}
</style>
