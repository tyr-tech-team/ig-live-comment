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
      aButton(size="small" @click="StratWatchLiveComments") {{"開啟直播留言監聽"}} 
      aButton(size="small" danger @click="StopWatchLiveComments") {{"停止直播留言監聽"}}
      aButton(size="small" danger @click="ClearCommentsHistory") {{"清除留言"}}
    //- ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
    .status {{`狀態：${isCommentsWatch?'監聽中':'停止監聽'}`}}
    .table-area
      IgCommentsTable(:commentList="commentList")
</template>

<script setup>
import debounce from "lodash/debounce";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { ref, createVNode, getCurrentInstance, onUnmounted } from "vue";
import IgCommentsTable from "./ig-comments-table.vue";
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  isOpen: { // 是否開啟
    type: Boolean,
    default: false
  },
  commentList: { // 留言列表
    type: Array,
    default: () => ([])
  }
});
const {proxy: {$fb, $moment, $storage}} = getCurrentInstance();

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const appId = ref("181443171333337"); // TODO harry: "1105528194174599" tyr: "181443171333337" // FB 應用 ID
const pageList = ref([]); // 粉專列表
const liveList = ref([]); // 直播列表
const selectPageId = ref(""); // 選中粉專
const selectBusinessId = ref(""); // 選中IG商業帳戶(專業帳戶)ID
const selectLiveMediaId = ref(""); // 選中直播
const count = ref(0); // 選中直播
let igCommentsInterval = null; // 取得IG留言循環
let commentsInterval = null; // 常態取得留言循環
const isCommentsWatch = ref(false);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
onUnmounted(()=>{
  DeleteIgCommentsInterval();
});
// Init ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Emit ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["update:isOpen", "merge-comments"]);
// v-model isOpen update
const EmitUpdateIsOpen = (value) => {
  emit("update:isOpen", false);
};
const EmitMergeComments = (_commentList) => {
  emit("merge-comments", _commentList);
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
  // 開啟直播監聽
  StratWatchLiveComments();
};

// 開啟直播留言監聽
const StratWatchLiveComments = () => {
  if (!selectLiveMediaId.value) return false;
  CreateIgCommentsInterval();
};

// 停止直播留言監聽
const StopWatchLiveComments = () => {
  DeleteIgCommentsInterval();
};

// 清除監聽資料
const ClearLiveComments = () => {
  DeleteIgCommentsInterval();
  props.commentList = [];
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

const MergeIgComments = async () => {
  const _commentList = await GetIGLiveComments();
  _commentList.reverse(); // 反轉
  if (_commentList.length > 0) {
    console.log("ss");
    EmitMergeComments(_commentList);
  }
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 清除快取留言
const ClearCommentsHistory = async()  => {
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
  if (!isOk) return;
  const keys = $storage.keys;
  $storage.Remove(keys.commentsHistory);
  props.commentList = [];
  DeleteIgCommentsInterval();
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開始讀取IG留言循環
const CreateIgCommentsInterval = async () => {
  await MergeIgComments();
  if (igCommentsInterval) return;
  isCommentsWatch.value = true;
  igCommentsInterval = setInterval(async() => {
    await MergeIgComments();
  }, 2000);
};

// 銷毀IG留言循環
const DeleteIgCommentsInterval = () => {
  isCommentsWatch.value = false;
  if(igCommentsInterval) clearInterval(igCommentsInterval);
  igCommentsInterval = null;
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
    return {label: item.id, value: item.id };
  });
  return true;
};

//  取得直播留言
const GetIGLiveComments = async() => {
  count.value++;
  let _count = 0;
  if (!selectLiveMediaId.value) return false;
  const {data, status: { isPass }} = await $fb.IGLiveComments(selectLiveMediaId.value);
  console.log("API", count.value, data, isPass);
  if (!isPass) {
    message.error("取得留言失敗");
    return [];
  }
  if (!data?.data) return [];
  return data.data.map((i) => {
    return {
      id: i.id,
      userId: i.from.id,
      userName: i.username.replaceAll(",","，"),
      createRfc: i.timestamp,
      createTime: Rfc3339ToDay(i.timestamp,"MM/DD HH:mm:ss"),
      timestamp: DayToNum(i.timestamp),
      text: i.text.replaceAll(",","，"), // CSV 避開
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
  .table-area {
    height: calc(100vh - 400px);
  }

}
</style>
