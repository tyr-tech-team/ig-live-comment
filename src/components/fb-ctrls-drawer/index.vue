<template lang="pug">
//- 請填寫功能描述👈
aDrawer(
  :visible="isOpen"
  class="custom-class"
  title="FB 控制"
  placement="right"
  width="500"
  @close="EmitUpdateIsOpen"
)
  #FbCtrlsDrawer
    .item-row
      p {{"App ID："}}
      aInput(v-model:value="appId" style="width: 200px" size="small")
    .item-row 
      aButton(type="primary" @click="DefaultFlow") {{"一鍵運行"}}
      aButton(size="small"  @click="ClickAuthorization") {{"授權"}}
      aButton(size="small" @click="ClickStatus") {{"狀態"}}
      aButton(size="small" @click="ClickInfo") {{"資訊"}}
      aButton(size="small" @click="ClickReAuthorization") {{"重新授權"}}
      aButton(size="small" danger @click="ClickFreed") {{"釋放"}}
    .item-row
      aButton(size="small" @click="GetFbPageList") {{"取得粉專列表"}}
      p {{"選擇粉專："}}
      aSelect(
        v-model:value="selectPageId"
        size="small"
        style="width: 200px"
        :options="pageList"
      )
    .item-row
      aButton(size="small" @click="GetIGBusinessInfoBtn") {{"取得IG商業帳戶列表"}}
      p {{`商業帳戶 ID：${selectBusinessId}`}}
    .item-row
      aButton(size="small" @click="GetIGLiveListBtn") {{"取得IG直播列表"}}
      p {{"直播列表："}}
      aSelect(
        v-model:value="selectLiveMediaId"
        size="small"
        style="width: 200px"
        :options="liveList"
      )
    .item-row
      aButton(size="small" @click="StratWatchLiveComments") {{"開啟直撥留言監聽"}} 
      aButton(size="small" danger @click="StopWatchLiveComments") {{"停止直撥留言監聽"}}
      aButton(size="small" @click="ClearLiveComments") {{"清除監聽資料"}}
    //- ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    .status {{`狀態：${isCommentsWatch?'監聽中':'停止監聽'}`}}
    IgCommentsTable(:commentList="commentList")
</template>

<script setup>
import { ref, getCurrentInstance, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import IgCommentsTable from "./ig-comments-table.vue";
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});
const {proxy: {$fb, $moment}} = getCurrentInstance();

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const fbRes = ref({res: null});  // 回傳
const appId = ref("1105528194174599"); // FB 應用 ID
const pageList = ref([]); // 粉專列表
const liveList = ref([]); // 直播列表
const commentList = ref([]); // 留言列表
const selectPageId = ref(""); // 選中粉專
const selectBusinessId = ref(""); // 選中IG商業帳戶(專業帳戶)ID
const selectLiveMediaId = ref(""); // 選中直播
const count = ref(0); // 選中直播
let commentsInterval = null; // 取得留言循環
const isCommentsWatch = ref(false);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
onUnmounted(()=>{
  DeleteInterval();
});
// Init ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Emit ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["update:isOpen"]);
// v-model isOpen update
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
  console.log("取得直播列表");
  // 取得直播列表
  if (!await GetIGLiveListBtn()) return;
  console.log("檢查直播");
  if (!liveList.value[0]) return;
  console.log("選定第一個直播");
  // 選定第一個直播
  selectLiveMediaId.value = liveList.value[0].value;
  // 開啟直撥監聽
  StratWatchLiveComments();
};

// 開啟直撥留言監聽
const StratWatchLiveComments = () => {
  if (!selectLiveMediaId.value) return false;
  CreateInterval();
};

// 停止直撥留言監聽
const StopWatchLiveComments = () => {
  DeleteInterval();
};

// 清除監聽資料
const ClearLiveComments = () => {
  DeleteInterval();
  commentList.value = [];
};
// 合併留言
const MergeComments = async () => {
  const _commentList = await GetIGLiveComments();
  _commentList.reverse(); // 反轉
  for (const _comment of _commentList) {
    const _findIndex = commentList.value.findIndex((i) => i.id === _comment.id);
    if (_findIndex >= 0) continue;
    commentList.value.push(_comment);
  }
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開始循環
const CreateInterval = async () => {
  await MergeComments();
  if (commentsInterval) return;
  isCommentsWatch.value = true;
  commentsInterval = setInterval(async() => {
    await MergeComments();
  }, 1000);
};

// 銷毀循環
const DeleteInterval = () => {
  isCommentsWatch.value = false;
  if(commentsInterval) clearInterval(commentsInterval);
  commentsInterval = null;
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
  console.log("data", data);
  pageList.value = data.data.map((item) => {
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

//  取得直播列表
const GetIGLiveListBtn = async() => {
  if (!selectBusinessId.value) return false;
  const {data, status: { isPass }} = await $fb.IGLiveList(selectBusinessId.value);
  if (!isPass) {
    message.error("取得直播列表失敗");
    return false;
  }
  liveList.value = data.data.map((item, index) => {
    return {label: `${index}直播`, value: item.id };
  });
  return true;
};

//  取得直播留言
const GetIGLiveComments = async() => {
  count.value++;
  if (!selectLiveMediaId.value) return false;
  const {data, status: { isPass }} = await $fb.IGLiveComments(selectLiveMediaId.value);
  console.log("API", count.value, data, isPass);
  if (!isPass) {
    message.error("取得留言失敗");
    return [];
  }
  console.log("comments", data);
  return data.data.map((i) => {
    return {
      id: i.id,
      userId: i.from.id,
      userName: i.username.replaceAll(",","，"),
      createRfc: i.timestamp,
      createTime: Rfc3339ToDay(i.timestamp,"MM/DD HH:mm:ss"),
      timestamp: DayToNum(i.timestamp),
      text: i.text.replaceAll(",","，"),
    };
  });
};

// 日期 轉 時間戳記
const DayToNum = (val) => $moment(val).unix();
const NumToDay = (val, format = "YYYY/MM/DD HH:mm:ss") => $moment.unix(val).utcOffset(8).format(format);
const Rfc3339ToDay = (date, format = "YYYY/MM/DD") => {
  if (!date) return "";
  return $moment(date).format(format);
};
const DayToRfc3339 = (rfc) => $moment(rfc).format();
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
defineExpose({ commentList });
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
    border-bottom: 1px solid #eee;
  }
  .status {
    font-weight: 400;
    color: #666b69;
  }
}
</style>
