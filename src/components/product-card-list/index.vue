<template lang="pug">
//- 商品卡片列表
#ProductCardList
  .btn-area 
    aButton(type="primary" @click="CreateProductCard") {{"新增商品"}}
    aButton(
      type="primary"
      :disalbed="productCardList.length === 0"
      danger
      @click="DeleteAllProductCard"
    ) {{"刪除全部商品"}}
  .card-list(ref="El_CardList")
    .card-item(v-for="cardInfo of productCardList" :key="cardInfo.uuid") 
      ProductCard(
        :cardInfo="cardInfo"
        :countdownInfo="countdownInfoObj[cardInfo.uuid]"
        :commentNumList="commentNumList"
        @on-delete="DeleteProductCard(cardInfo.uuid)"
        @on-change="EmitSave"
      )
</template>

<script setup>
import debounce from "lodash/debounce";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { ref, computed, nextTick, reactive, onMounted, onUnmounted, getCurrentInstance,createVNode } from "vue";

import ProductCard from "./product-card/index.vue"; // 商品卡片

const {proxy: {$storage}} = getCurrentInstance();
const El_CardList = ref(null);
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const props = defineProps({
  countdownInfoObj: { // 計時器資訊
    type: Object,
    default: () => ({})
  },
  productCardList: { // 卡片列表
    type: Array,
    default: () => ([])
  },
  commentList: { // 留言資訊
    type: Array,
    default: () => ([])
  }
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const emit = defineEmits(["on-save",]);
const EmitSave = () => {
  emit("on-save");
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 過濾擁有數字的訊息
const commentNumList = computed(() => {
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
// 新增商品卡片
const CreateProductCard = () => {
  props.productCardList.push({
    uuid: CreateUUID(), // 唯一ID
    name: "",
    increase: 1000, // 增加量
    basicPrice: 0,
    topPrice: 0,
    winner: null
  });
  CardListScrollToDown();
  EmitSave();
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
    props.productCardList.length = 0;
    EmitSave();
  }

};

// 卡片列表置底
const CardListScrollToDown = () => {
  nextTick(() => {
    const el = El_CardList.value;
    el.scrollBy({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  });
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 刪除商品卡片
const DeleteProductCard = (uuid) => {
  const findIndex = props.productCardList.findIndex((i) => i.uuid === uuid);
  if (findIndex > -1)  props.productCardList.splice(findIndex, 1);
  EmitSave();
};

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
</script>

<style lang="scss" scoped>
// 佈局
#ProductCardList {
  height: calc(100vh - 80px);
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
