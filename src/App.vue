<template lang="pug">
//- 請填寫功能描述👈
#Home
  .row-item
    aButton(type="primary" @click="OpenFBCtrlDrawer") {{"FB 控制項"}}
  .ctrl-box
    .countdown-area
      LiveCountdown(
        @on-create="CardCreate"
        @on-start="OnCountdownStart"
        @on-complete="OnCountdownComplete"
        @on-cancel="CardDelete"
      )
    .card-area
      .card-item(v-for="(cardInfo,i) of cardList" :key="cardInfo.uuid")
        SnapUpCard(:cardInfo="cardInfo" :commentList="commentList")
    .comments-area 
      IgCommentsTable(:commentList="commentList")
//------------------
FbCtrlsDrawer(ref="FbCtrlsDrawer1" v-model:isOpen="openDrawer")
</template>

<script setup>
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue"; // FB IG 控制抽屜
import LiveCountdown from "@/components/live-countdown/index.vue"; // 倒數計時器
import SnapUpCard from "@/components/snap-up-card/index.vue"; // 搶購倒數卡片
import IgCommentsTable from "@/components/fb-ctrls-drawer/ig-comments-table.vue"; // 留言 Table

import { ref, computed, nextTick, reactive } from "vue";

const openDrawer =ref(false); // 開啟抽屜
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 同步訊息列表
const FbCtrlsDrawer1 = ref(null);
const commentList = ref([]);
const currentUUID = ref("");
const cardList = ref([]);
nextTick(() => {
  commentList.value = FbCtrlsDrawer1.value.commentList;
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 建立新卡片
const CardCreate = (uuid) => {
  console.log("create",uuid);
  currentUUID.value = uuid;
  cardList.value.unshift(ref({
    uuid, // 唯一ID
    startAt: "", // 開始時間
    endAt: "", // 結束時間
    name: "",
    increase: 1000, // 增加量
    basicPrice: 0
  }));
};

// 倒數取消後刪除
const CardDelete = (uuid) => {
  console.log("cancel", uuid);

  const findIndex = cardList.value.findIndex((i) => i.uuid === uuid);

  if (findIndex > -1)  cardList.value.splice(findIndex, 1);
};

// 開始正式倒數
const OnCountdownStart = (uuid) => {
  console.log("start",uuid);
  const find = cardList.value.find((i) => i.value.uuid === uuid);
  console.log(find);
  if (find) find.value.startAt = new Date().valueOf();
};

// 倒數完成
const OnCountdownComplete = (uuid) => {
  console.log("complete", uuid);
  const find = cardList.value.find((i) => i.value.uuid === uuid);
  if (find) find.value.endAt = new Date().valueOf();
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
  padding: 20px;
  .ctrl-box {
    display: grid;
    grid-template-columns: auto minmax(600px, 1fr) 400px;
    grid-template-areas: "countdown card comments";
    gap: 50px;
    .countdown-area {
      grid-area: countdown;
    }
    .card-area {
      grid-area: card;
    }
    .comments-area {
      grid-area: comments
    }
  }
}
// 組件
#Home {
  .row-item {
    display: flex;
    gap: 10px;
  }
}
</style>
