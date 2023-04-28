<template lang="pug">
//- 請填寫功能描述👈
#Home
  .ctrl-box
    .countdown-area
      LiveCountdown(
        :productCardList="productCardList"
        @on-product-change="OnProductSelectChange"
      )
    .card-area
      aButton(type="primary" @click="CreateProductCard") {{"新增商品"}}
      .card-list(ref="CardList")
        .card-item(v-for="productInfo of productCardList" :key="productInfo.uuid") 
          ProductCard(
            :productInfo="productInfo" 
            :commentList="commentNumList"
            :colseDisabled="selectedProductId === productInfo.uuid"
            @on-delete="DeleteProductCard(productInfo.uuid)"
          )
    .comments-area 
      aButton(type="primary" @click="OpenFBCtrlDrawer") {{"FB 控制項"}}
      IgCommentsTable(:commentList="commentList")
//------------------
FbCtrlsDrawer(ref="FbCtrlsDrawer1" v-model:isOpen="openDrawer")
</template>

<script setup>
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue"; // FB IG 控制抽屜
import LiveCountdown from "@/components/live-countdown/index.vue"; // 倒數計時器
import ProductCard from "@/components/product-card/index.vue"; // 商品卡片
import IgCommentsTable from "@/components/fb-ctrls-drawer/ig-comments-table.vue"; // 留言 Table

import { ref, computed, nextTick, reactive, onMounted } from "vue";

const openDrawer =ref(false); // 開啟抽屜
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 同步訊息列表
const FbCtrlsDrawer1 = ref(null);
const isMounted = ref(false);
const CardList = ref(null);
const selectedProductId = ref("");
const productCardList = reactive([]); // 商品卡片列表
onMounted(() => {
  isMounted.value = true;
});
const commentList = computed(() => {
  if (!isMounted.value ) return [];
  return FbCtrlsDrawer1.value.commentList;
});

// 過濾有數字的訊息
const commentNumList = computed(() => {
  if (!isMounted.value ) return [];
  return FbCtrlsDrawer1.value.commentList
    .map((i) => {
      return {
        ...i,
        nums: i.text.match(/\d+(\.\d+)?/g)
      };
    })
    .filter((i) => i.nums );
});

const reverseCommentList = computed(() => {
  if (!isMounted.value ) return [];
  const _list = commentList.value;
  return _list;
});
// 訊息 +1 的列表
const add1CommentList = computed(() => {
  return commentList.value.filter((comment) => comment.text.includes("+1")).reverse(); // 反轉
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 建立新卡片
const OnProductSelectChange = (_selectedProductId) => {
  selectedProductId.value = _selectedProductId;
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 新增商品卡片
const CreateProductCard = () => {
  productCardList.push({
    uuid: CreateUUID(), // 唯一ID
    startAt: "", // 開始時間
    endAt: "", // 結束時間
    name: "",
    increase: 1000, // 增加量
    basicPrice: 0,
    topPrice: 0,
    isComplete: false
  });
  CardListScrollToDown();
};

// 刪除商品卡片
const DeleteProductCard = (uuid) => {
  const findIndex = productCardList.findIndex((i) => i.uuid === uuid);
  if (findIndex > -1)  productCardList.splice(findIndex, 1);
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
// 卡片列表置頂
const CardListScrollToDown = () => {
  nextTick(() => {
    const el = CardList.value;
    console.dir(el);
    el.scrollBy({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  });
};
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 開啟 FB 控制抽屜
const OpenFBCtrlDrawer = async () => {
  openDrawer.value = true;
};

</script>

<style lang="scss" scoped>
// 佈局
#Home {
  // padding: 20px;
  .ctrl-box {
    display: grid;
    grid-template-columns: auto minmax(680px, 1fr) 400px;
    grid-template-areas: "countdown card comments";
    gap: 20px;
    .countdown-area {
      padding: 20px;
      grid-area: countdown;
    }
    .card-area {
      padding: 20px;
      height: calc(100vh - 20px);
      grid-area: card;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 10px;

    }
    .comments-area {
      padding: 20px;
      grid-area: comments
    }
  }
}
// 組件
#Home {
  .card-list {
    // max-height: 500px;
    overflow: auto;
    .card-item {
      padding-top: 10px;
    }
  }
  .row-item {
    display: flex;
    gap: 10px;
  }
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