<template lang="pug">
//- 請填寫功能描述👈
#Home
  .ctrl-box
    .countdown-area
      LiveCountdown(
        :productCardList="productCardList"
        @on-product-change="OnProductSelectChange"
        @on-save="OnSaveProductCardList"
      )
    .card-area
      ProductCardList(
        ref="El_ProductCardList"
        :commentList="commentList"
        :selectedProductId="selectedProductId"
      )

    .comments-area 
      aButton(type="primary" @click="OpenFBCtrlDrawer") {{"FB 控制項"}}
      IgCommentsTable(:commentList="commentList")
//------------------
FbCtrlsDrawer(ref="El_FbCtrlsDrawer" v-model:isOpen="openDrawer")
</template>

<script setup>
import debounce from "lodash/debounce";
import ProductCardList from "@/components/product-card-list/index.vue"; // 商品卡片列表
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue"; // FB IG 控制抽屜
import LiveCountdown from "@/components/live-countdown/index.vue"; // 倒數計時器
import IgCommentsTable from "@/components/fb-ctrls-drawer/ig-comments-table.vue"; // 留言 Table
import { ref, computed, onMounted, getCurrentInstance } from "vue";

const openDrawer =ref(false); // 開啟抽屜
const {proxy: {$storage}} = getCurrentInstance();

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 同步訊息列表
const El_FbCtrlsDrawer = ref(null);
const El_ProductCardList = ref(null);
const isMounted = ref(false);
const CardList = ref(null);
const selectedProductId = ref("");

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 留言列表
const commentList = computed(() => {
  if (!isMounted.value ) return [];
  return El_FbCtrlsDrawer.value.commentList;
});

// 過濾擁有數字的訊息
const productCardList = computed(() => {
  if (!isMounted.value ) return [];
  return El_ProductCardList.value.productCardList ? El_ProductCardList.value.productCardList : [];
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
onMounted(() => {
  isMounted.value = true;
});

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 建立新卡片
const OnProductSelectChange = (_selectedProductId) => {
  selectedProductId.value = _selectedProductId;
};

// 儲存商品卡片列表
const OnSaveProductCardList = () => {
  console.log("save");
  El_ProductCardList.value.SaveProductList();
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
    .comments-area {
      padding: 20px;
      grid-area: comments
    }
  }
}
// 組件
#Home {
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