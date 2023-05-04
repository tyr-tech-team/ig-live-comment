<template lang="pug">
//- 商品卡片列表
#ProductCardList
  .btn-area 
    aButton(type="primary" @click="CreateProductCard") {{"新增商品"}}
    aButton(
      type="primary"
      :disalbed="productCardList.length === 0"
      @click="DeleteAllProductCard"
    ) {{"刪除全部商品"}}
  .card-list(ref="CardList")
    .card-item(v-for="cardInfo of productCardList" :key="cardInfo.uuid") 
      ProductCard(
        :cardInfo="cardInfo" 
        :commentNumList="commentNumList"
        :colseDisabled="selectedProductId === cardInfo.uuid"
        @on-delete="DeleteProductCard(cardInfo.uuid)"
        @on-change="SaveProductList"
      )
</template>

<script setup>
import debounce from "lodash/debounce";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { ref, computed, nextTick, reactive, onMounted, onUnmounted, getCurrentInstance,createVNode } from "vue";

import ProductCard from "./product-card/index.vue"; // 商品卡片

const {proxy: {$storage}} = getCurrentInstance();
const isMounted = ref(false);
const CardList = ref(null);
const productCardList = ref([]); // 商品卡片列表

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  commentList: { // 留言資訊
    type: Array,
    default: () => ([])
  },
  selectedProductId: { // 被選擇的商品卡片ID
    type: String,
    default: ""
  }
});

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 過濾擁有數字的訊息
const commentNumList = computed(() => {
  if (!isMounted.value ) return [];
  return props.commentList
    .map((m) => {
      return {
        ...m,
        nums: (m.text.match(/\d+(\.\d+)?/g))?.map((i) => Number(i)) || []
      };
    })
    .filter((i) => i.nums );
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
onMounted(() => {
  CreateProductRefreshInterval(); // 商品卡片刷新循環
  isMounted.value = true;
});

onUnmounted(()=>{
  DeleteProductRefreshInterval(); // 移除商品卡片刷新循環
});

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
let productInterval = null; // 取得留言循環
// 開始商品卡片刷新循環
const CreateProductRefreshInterval = async () => {
  if (productInterval) return;
  GetProductList();
  productInterval = setInterval(async() => {
    GetProductList();
  }, 2000);
};

// 銷毀商品卡片刷新循環
const DeleteProductRefreshInterval = () => {
  if(productInterval) clearInterval(productInterval);
  productInterval = null;
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 新增商品卡片
const CreateProductCard = () => {
  productCardList.value.push({
    uuid: CreateUUID(), // 唯一ID
    startAt: "", // 開始時間
    endAt: "", // 結束時間
    name: "",
    increase: 1000, // 增加量
    basicPrice: 0,
    topPrice: 0,
    isComplete: false,
    winner: null
  });
  CardListScrollToDown();
  SaveProductList();
};

// 刪除全部商品
const DeleteAllProductCard = async() => {
  const isOk = await new Promise((resolve) =>
    Modal.confirm({
      title: "刪除確認",
      icon: createVNode(ExclamationCircleOutlined),
      content: "確定要刪除全部商品嗎？",
      okText: "刪除",
      cancelText: "取消",
      onOk() {resolve(true);},
      onCancel() {resolve(false);},
    })
  );
  if (isOk) {
    productCardList.value = [];
    SaveProductList();
  }

};

// 卡片列表置底
const CardListScrollToDown = () => {
  nextTick(() => {
    const el = CardList.value;
    el.scrollBy({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  });
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 刪除商品卡片
const DeleteProductCard = (uuid) => {
  const findIndex = productCardList.value.findIndex((i) => i.uuid === uuid);
  if (findIndex > -1)  productCardList.value.splice(findIndex, 1);
  SaveProductList();
};

const updateLock = ref(false);

// 儲存商品卡片
const SaveProductList = () => {
  updateLock.value = true;
  SaveProductListFlow();
};
// 儲存商品卡片
const SaveProductListFlow = debounce(function () {
  updateLock.value = true;
  const keys = $storage.keys;
  const obj = {
    cardList: productCardList.value
  };
  $storage.Set(keys.productCard, obj);
  SetUnLock();
}, 100);
// 解鎖
const SetUnLock = debounce(function () {
  updateLock.value = false;
}, 1000);

// 取得商品卡片
const GetProductList = (() => {
  if (updateLock.value) return;
  const keys = $storage.keys;
  const obj = $storage.Get(keys.productCard);
  if (obj && obj.cardList) {
    if (updateLock.value) return;
    SynchronizeProductCardList(obj.cardList);
  }
});

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
    ObjectEqual(findCard, cardItem, ["winner"]);
  }
};

// object 值互等
const ObjectEqual = (aObj, bObj, passKeys) => {
  if (Object.is(aObj, bObj)) return;
  if (!isObject(bObj)) return;
  for (const key in aObj) {
    if ( passKeys.includes(key) ) continue;
    if (isObject(bObj[key])) {
      ObjectEqual(aObj[key], bObj[key]);
    } else {
      aObj[key] = bObj[key];
    }
  }
};

// check object
const isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";


// 生成唯一ID
const CreateUUID = () => {
  let d = Date.now();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 對外
defineExpose({ productCardList, SaveProductList });
</script>

<style lang="scss" scoped>
// 佈局
#ProductCardList {
  padding: 20px;
  height: calc(100vh - 20px);
  grid-area: card;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  
}
// 組件
#ProductCardList {
  .btn-area {
    display: flex;
    justify-content: space-between;
    gap: 50px;
  }
  .card-list {
    // max-height: 500px;
    overflow: auto;
    .card-item {
      padding-top: 10px;
    }
  }
}
</style>
