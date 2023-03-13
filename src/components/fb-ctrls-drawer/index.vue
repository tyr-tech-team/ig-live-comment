<template lang="pug">
//- 請填寫功能描述👈
aDrawer(
  :visible="isOpen"
  class="custom-class"
  title="FB 控制"
  placement="right"
  width="500"
  @after-visible-change="afterVisibleChange"
  @close="EmitUpdateIsOpen"
)
  #FbCtrlsDrawer
    .item-row
      p {{"App ID："}}
      aInput(v-model:value="appId" style="width: 200px" size="small")
    .item-row 
      aButton(size="small" type="primary" @click="ClickAuthorization") {{"授權"}}
      aButton(size="small" @click="ClickStatus") {{"狀態"}}
      aButton(size="small" @click="ClickInfo") {{"資訊"}}
      aButton(size="small" @click="ClickReAuthorization") {{"重新授權"}}
      aButton(size="small" type="primary" danger @click="ClickFreed") {{"釋放"}}
      aButton(size="small" type="primary" @click="DefaultFlow") {{"預設流程"}}
    .item-row
      aButton(type="primary" size="small" @click="GetFbPageList") {{"取得粉專列表"}}
      p {{"選擇粉專："}}
      aSelect(
        v-model:value="selectPageId"
        size="small"
        style="width: 200px"
        :options="pageList"
      )
    .item-row
      aButton(type="primary" size="small" @click="GetIGBusinessInfoBtn") {{"取得IG商業帳戶列表"}}
      p {{`商業帳戶 ID：${selectBusinessId}`}}
    .item-row
      aButton(type="primary" size="small" @click="GetIGLiveListBtn") {{"取得IG直撥列表"}}
      p {{"直撥列表："}}
      aSelect(
        v-model:value="selectLiveMediaId"
        size="small"
        style="width: 200px"
        :options="liveList"
      )
    .item-row
      aButton(type="primary" size="small" @click="IGLiveCommentsBtn") {{"取得IG直撥留言"}}
    pre {{ commentList }}
</template>

<script setup>
import { inject, ref } from "vue";
import { message } from "ant-design-vue";

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps(
  {
    isOpen: Boolean
  }
);
const $fb = inject("$fb");
const emit = defineEmits(["update:isOpen"]);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const openDrawer =ref(true); // 開啟抽屜
const fbRes = ref({res: null});  // 回傳
let appId = ref("1105528194174599"); // FB 應用 ID
let pageList = ref([]); // 粉專列表
let liveList = ref([]); // 直撥列表
let commentList = ref([]); // 留言列表
let selectPageId = ref(""); // 選中粉專
let selectBusinessId = ref(""); // 選中IG商業帳戶(專業帳戶)ID
let selectLiveMediaId = ref(""); // 選中直撥

// Init ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Emit ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 
const EmitUpdateIsOpen = (value) => {
  emit("update:isOpen", false);
};

// Event ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Flow ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const DefaultFlow = async () => {
  console.log("授權");
  // 授權
  if (!await ClickAuthorization()) return;
  console.log("取得粉專列表");
  // 取得粉專列表
  if (!await GetFbPageList()) return;
  console.log("檢查粉專");
  // 檢查粉專
  if (!pageList.value[0]) return;
  console.log("選定第一個粉專");
  // 選定第一個粉專
  selectPageId.value = pageList.value[0].value;
  console.log("取得 IG 商業 ID");
  // 取得 IG 商業 ID
  if (!await GetIGBusinessInfoBtn()) return;
  console.log("取得直撥列表");
  // 取得直撥列表
  if (!await GetIGLiveListBtn()) return;
  console.log("檢查直撥");
  if (!liveList.value[0]) return;
  console.log("選定第一個直撥");
  // 選定第一個直撥
  selectLiveMediaId.value = liveList.value[0].value;
};
// Function ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 取得狀態
const ClickStatus = async () => {
  const {status: { isPass }} = await $fb.Status(appId.value);
  if (isPass) {
    message.success("取得狀態成功");
    return true;
  }
  message.error("取得狀態失敗");
  return false;
};

// 取得授權
const ClickAuthorization = async() => {
  const {status: { isPass }} = await $fb.Authorization(appId.value);
  if (isPass) {
    message.success("授權成功");
    return true;
  }
  message.error("授權失敗");
  return false;
};

// 釋放
const ClickFreed = async() => {
  const {status: { isPass }} = await $fb.Freed(appId.value);
  if (isPass) {
    message.success("權限釋放成功");
    return true;
  }
  message.error("權限釋放失敗");
  return false;
};

// 取得會員資訊
const ClickInfo = async() => {
  const {status: { isPass }} = await $fb.Info(appId.value);
  if (isPass) {
    message.success("取得資訊成功");
    return true;
  }
  message.error("取得資訊失敗");
  return false;
};

// 取得重新授權按鈕
const ClickReAuthorization = async() => {
  const {status: { isPass }} = await $fb.Authorization(appId.value);
  if (isPass) {
    message.success("重新授權成功");
    return true;
  }
  message.error("重新授權失敗");
  return false;
};

//  取得粉專列表
const GetFbPageList = async() => {
  const {data, status: { isPass }} = await $fb.FbPageList();

  if (!isPass) {
    message.error("取得粉專列表失敗");
    return false;
  }
  pageList.value = data. data.map((item) => {
    return {label: item.name, value: item.id};
  });
  return true;
};

//  取得IG商業帳戶
const GetIGBusinessInfoBtn = async() => {
  if (!selectPageId.value) return false;
  const {data, status: { isPass }} = await $fb.IGBusinessInfo(selectPageId.value);
  if (!isPass) {
    message.error("取得IG商業帳戶失敗");
    return false;
  }
  selectBusinessId.value = data.instagram_business_account.id;
  return true;
};

//  取得直撥列表
const GetIGLiveListBtn = async() => {
  if (!selectBusinessId.value) return false;
  const {data, status: { isPass }} = await $fb.IGLiveList(selectBusinessId.value);
  if (!isPass) {
    message.error("取得直撥列表失敗");
    return false;
  }
  liveList.value = data.data.map((item, index) => {
    return {label: `${index}直撥`, value: item.id };
  });
  return true;
};

//  取得直撥留言
const IGLiveCommentsBtn = async() => {
  if (!selectLiveMediaId.value) return false;
  const {data, status: { isPass }} = await $fb.IGLiveComments(selectLiveMediaId.value);
  if (!isPass) {
    message.error("取得留言失敗");
    return false;
  }
  console.log(data);
  commentList.value = data.data.map((i) => {
    return {
      id: i.id,
      userId: i.id,
      userName: i.username,
      createAt: i.timestamp,
      text: i.text,
    };
  });
  return true;
};
</script>

<style lang="scss" scoped>
// 佈局
#FbCtrlsDrawer {
  font-weight: bold;
}
// 組件
#FbCtrlsDrawer {
  .item-row {
    padding: 5px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #ddd;
  }
}
</style>
