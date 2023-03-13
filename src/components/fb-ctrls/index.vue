<template lang="pug">
//- 請填寫功能描述👈
#FbCtrls
  .item-row
    p {{"App ID："}}
    aInput(v-model:value="appId" style="width: 200px" size="small")
    aButton(type="primary" @click="ClickAuthorizationBtn" size="small") {{"授權"}}
    aButton(@click="DemoTest" size="small") {{"狀態"}}
    aButton(@click="ClickInfoBtn" size="small") {{"資訊"}}
    aButton(@click="ClickReAuthorizationBtn" size="small") {{"重新授權"}}
    aButton(@click="ClickFreedBtn" type="primary" danger size="small") {{"釋放"}}
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
const DemoTest = () =>  {
  console.log("test");
};
</script>

<style lang="scss" scoped>
// 佈局
#FbCtrls {
  font-weight: bold;
  // color: #666;
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
