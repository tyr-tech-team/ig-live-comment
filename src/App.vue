<template lang="pug">
//- 請填寫功能描述👈
#Home
  aTabs(v-model:activeKey="activeKey")
    aTabPane(key="1" tab="計時器")
    aTabPane(key="2" tab="商品卡片與留言")
  .tab-item(v-if="activeKey==='1'")
    LiveCountdown(
      :productCardList="productCardList"
      :countdownInfoObj="countdownInfoObj"
      @on-save="SetCountdownInfoObj"
    )
  .tab-item.card-and-comment-area(v-if="activeKey==='2'")
    .left-area
      ProductCardList(
        :countdownInfoObj="countdownInfoObj"
        :productCardList="productCardList"
        :commentList="commentList"
        @on-save="SaveProductList"
      )
    .right-area
      aButton(type="primary" @click="OpenFBCtrlDrawer") {{"FB 控制項"}}
      IgCommentsTable(:commentList="commentList")
      FbCtrlsDrawer(
        v-model:isOpen="openDrawer"
        :commentList="commentList"
        @merge-comments="SetComments"
      )
</template>

<script setup>
import {ref, computed, onUnmounted, onMounted, getCurrentInstance } from "vue";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import ProductCardList from "@/components/product-card-list/index.vue"; // 商品卡片列表
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue"; // FB IG 控制抽屜
import LiveCountdown from "@/components/live-countdown/index.vue"; // 倒數計時器
import IgCommentsTable from "@/components/fb-ctrls-drawer/ig-comments-table.vue"; // 留言 Table

const openDrawer =ref(false); // 開啟抽屜
const { proxy: { $storage, $moment } } = getCurrentInstance();
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 同步訊息列表
const isMounted = ref(false);
const activeKey = ref("1");
const countdownInfoObj = ref({});
const productCardList = ref([]);
const commentList = ref([]);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const productCardIds = computed(() =>{ // 商品卡片ID列表
  return productCardList.value.map((i) => i.uuid);
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
let getDataInterval = "";
onMounted(() => {
  GetDataInfo();
  getDataInterval = setInterval(() => {
    GetDataInfo();
  }, 1000);
  isMounted.value = true;
});
  
onUnmounted(()=>{
  if(getDataInterval) clearInterval(getDataInterval);
  getDataInterval = null;
});
let count = 0;
const GetDataInfo = () => {
  count++;
  GetCountdownInfoObj(); // 計時器資訊
  GetProductList(); // 商品卡片資訊
  if (count >= 2) {
    GetComments(); // 留言資訊
    count = 0;
  }
};
// Countdown ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
let SaveCountdonwLock = ref(false);
// 取得計時器資訊
const GetCountdownInfoObj = () => {
  if (SaveCountdonwLock.value) return;
  const keys =  $storage.keys;
  countdownInfoObj.value = $storage.Get(keys.countdonw) || {};
};

const SetCountdownInfoObj = () => {
  console.log("s countdown");
  SaveCountdonwLock.value = true;
  const keys =  $storage.keys;
  const _saveObj = {};
  for (const key in countdownInfoObj.value) {
    if (!productCardIds.value.includes(key)) continue;
    _saveObj[key] = countdownInfoObj.value[key];
  }
  $storage.Set(keys.countdonw, _saveObj);
  SetCountdownUnlock();
};

// // 解鎖
const SetCountdownUnlock = debounce(function () {
  saveProductLock.value = false;
}, 1000);
// Product Card ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
let productInterval = null; // 取得留言循環
const saveProductLock = ref(false);

// 取得商品卡片
const GetProductList = () => {
  if (saveProductLock.value) return;
  saveProductLock.value = true;
  const keys = $storage.keys;
  const obj = $storage.Get(keys.productCard);
  if (obj && obj.cardList) {
    saveProductLock.value = true;
    SynchronizeProductCardList(obj.cardList);
    saveProductLock.value = false;
  }
};

// 同步商品卡片列表
const SynchronizeProductCardList = (cardList) => {
  const idList = cardList.map((i) => i.uuid);
  // 移除差異
  for (const cardItem of productCardList.value ) {
    // 不存在移除
    if (!idList.includes(cardItem.uuid)) {
      const removeIndex = productCardList.value.findIndex((i) => i.uuid === cardItem.uuid);
      productCardList.value.splice(removeIndex, 1);
    }
  }
  // 取得來源同步
  for (const cardItem of cardList) {
    const findCard = productCardList.value.find((i) => i.uuid === cardItem.uuid);
    // 不存在，插入
    if (!findCard) {
      productCardList.value.push(cardItem);
      continue;
    }
    // 存在，刷新 
    ObjectEqual(findCard, cardItem);
  }
};
//--------------------------------
// 儲存商品卡片
const SaveProductList = () => {
  console.log("s product");
  saveProductLock.value = true;
  SaveProductListFlow();
};

// 儲存商品卡片
const SaveProductListFlow = throttle(function () {
  const keys = $storage.keys;
  const obj = {
    cardList: productCardList.value
  };
  $storage.Set(keys.productCard, obj);
  // SetProductLock(false);
  SetProductUnlock();
}, 1000);

// // 解鎖
const SetProductUnlock = debounce(function () {
  saveProductLock.value = false;
}, 1000);

// IG Comment ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const saveCommentLock = ref(false);
let commentsInterval = null; // 常態取得留言循環

// 取得歷史留言
const GetComments = () => {

  if (saveCommentLock.value) return;
  const keys =  $storage.keys;
  const commentKey = `${$moment().format("YYYYMMDD")}`;
  const obj = $storage.Get(keys.commentsHistory) || [];
  const _commentList = obj?.[commentKey] || [];
  if (saveCommentLock.value) return;
  if (_commentList.length === 0) {
    commentList.value = [];
    return;
  }
  for (const item of _commentList) {
    const find = commentList.value.find((i)=> i.id === item.id);
    if (!find) commentList.value.push(item);
  }
};
//-----------------------------
// 留言寫入localstorage
const SetComments = (_commentList) => {
  console.log("s comments");
  let _count = 0;
  for (const _comment of _commentList) {
    const _findIndex = commentList.value.findIndex((i) => i.id === _comment.id);
    if (_findIndex >= 0) continue;
    saveCommentLock.value = true;
    commentList.value.push(_comment);
    _count++;
  }
  if (_count === 0) return;
  //----------------------------
  const commentKey = `${$moment().format("YYYYMMDD")}`;
  const obj = {};
  obj[commentKey] = commentList.value;
  const keys = $storage.keys;
  $storage.Set(keys.commentsHistory, obj);
  SetComentUnlock();
};

// 解鎖
const SetComentUnlock = debounce(function () {
  saveCommentLock.value = false;
}, 1000);

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// object 值互等
const ObjectEqual = (aObj, bObj) => {
  if (Object.is(aObj, bObj)) return;

  if (!isObject(bObj)) return;
  for (const key in aObj) {
    if (key === "winner") {
      aObj[key] = bObj[key]; continue;
    }
    if (isObject(bObj[key])) {
      ObjectEqual(aObj[key], bObj[key]);
    } else {
      aObj[key] = bObj[key];
    }
  }
};

// check object
const isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡


// 開啟 FB 控制抽屜
const OpenFBCtrlDrawer = async () => {
  openDrawer.value = true;
};
</script>

<style lang="scss" scoped>
// 佈局
#Home {
  padding: 0 20px;

  .card-and-comment-area {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }
}
// 組件
#Home {
}
</style>

<style lang="scss">
// scrol
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  margin: 5px;
}
::-webkit-scrollbar-thumb {
  background:#c9c9c974;
  border-radius: 30px;
  background-clip: padding-box !important;
  border: solid transparent !important;
  cursor: pointer !important;
}
::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-corner {
  background-color: transparent !important;  /* 滾動條的顏色 */
}
</style>