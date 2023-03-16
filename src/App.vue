<template lang="pug">
//- 請填寫功能描述👈
#Home
  .row-item
    aButton(type="primary" @click="OpenFBCtrlDrawer") {{"FB 控制項"}}
  .ctrl-box
    .countdown-area
      LiveCountdown(
        @on-start="OnCountdownStart"
        @on-complete="OnCountdownComplete"
        @on-cancel="OnCountdownCancel"
      )
    .card-area
      pre {{ commentList }}
    .comments-area 
      IgCommentsTable(:commentList="commentList")
//------------------
FbCtrlsDrawer(ref="FbCtrlsDrawer1" v-model:isOpen="openDrawer")
</template>

<script setup>
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue";
import LiveCountdown from "@/components/live-countdown/index.vue";
import IgCommentsTable from "@/components/fb-ctrls-drawer/ig-comments-table.vue";

import { ref, computed, nextTick } from "vue";

const openDrawer =ref(false); // 開啟抽屜
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 同步訊息列表
const FbCtrlsDrawer1 = ref(null);
const commentList = ref([]);
nextTick(() => {
  commentList.value = FbCtrlsDrawer1.value.commentList;
});
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
const OnCountdownStart = (uuid) => {
  console.log("start",uuid);
};
const OnCountdownComplete = (uuid) => {
  console.log("complete", uuid);
};
const OnCountdownCancel = (uuid) => {
  console.log("cancel", uuid);
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
    grid-template-columns: auto 1fr 400px;
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
