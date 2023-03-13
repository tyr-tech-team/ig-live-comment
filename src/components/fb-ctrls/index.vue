<template lang="pug">
//- 請填寫功能描述👈
#FbCtrls
  .item-row
    p {{"App ID："}}
    aInput(v-model:value="appId" style="width: 200px" size="small")
  .item-row 
    aButton(type="primary" size="small" @click="ClickAuthorizationBtn") {{"授權"}}
    aButton(@click="ClickStatusBtn" size="small") {{"狀態"}}
    aButton(@click="ClickInfoBtn" size="small") {{"資訊"}}
    aButton(@click="ClickReAuthorizationBtn" size="small") {{"重新授權"}}
    aButton(@click="ClickFreedBtn" type="primary" danger size="small") {{"釋放"}}
  .item-row
    aButton(type="primary" size="small" @click="ClickFbPageListBtn") {{"取得粉專列表"}}
    p {{"選擇粉專："}}
    aSelect(
      v-model:value="selectPageId"
      size="small"
      style="width: 200px"
      :options="pageList"
    )
  .item-row
    aButton(type="primary" size="small" @click="ClickIGBusinessInfoBtn") {{"取得IG商業帳戶列表"}}
    p {{`商業帳戶 ID：${selectBusinessId}`}}
  .item-row
    aButton(type="primary" size="small" @click="ClickIGLiveListBtn") {{"取得IG直撥列表"}}
    p {{"直撥列表："}}
    aSelect(
      v-model:value="selectLiveMediaId"
      size="small"
      style="width: 200px"
      :options="liveList"
    )
  .item-row
    aButton(type="primary" size="small" @click="ClickIGLiveCommentsBtn") {{"取得IG直撥留言"}}
  pre {{ commentList }}
</template>

<script setup>
import { inject, ref } from "vue";
const $fb = inject("$fb");

const fbRes = ref({res: null});  // 回傳
let appId = ref("1105528194174599"); // FB 應用 ID
let pageList = ref([]); // 粉專列表
let liveList = ref([]); // 直撥列表
let commentList = ref([]); // 留言列表
let selectPageId = ref(""); // 選中粉專
let selectBusinessId = ref(""); // 選中IG商業帳戶(專業帳戶)ID
let selectLiveMediaId = ref(""); // 選中直撥
// --------------------------------------------
// 取得狀態
const ClickStatusBtn = async () => fbRes.value.res = await $fb.Status(appId.value);
// 取得授權
const ClickAuthorizationBtn = async() => fbRes.value.res = await $fb.Authorization(appId.value);
// 釋放
const ClickFreedBtn = async() => fbRes.value.res = await $fb.Freed(appId.value);
// 取得會員資訊
const ClickInfoBtn = async() => fbRes.value.res = await $fb.Info(appId.value);
// 取得重新授權按鈕
const ClickReAuthorizationBtn = async() => fbRes.value.res = await $fb.Authorization(appId.value);
// --------------------------------------------
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

</script>

<style lang="scss" scoped>
// 佈局
#FbCtrls {
  font-weight: bold;
}
// 組件
#FbCtrls {
  .item-row {
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #ccc;
  }
}
</style>
