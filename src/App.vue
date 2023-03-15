<template lang="pug">
//- 請填寫功能描述👈
#Home
  .row-item
    aButton(type="primary" @click="OpenCtrlDrawer") {{"FB 控制項"}}
    //- aButton(type="primary" @click="") {{"新增計時器"}}
  LiveCountdown
//------------------
FbCtrlsDrawer(v-model:isOpen="openDrawer")
</template>

<script setup>
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue";
import LiveCountdown from "@/components/live-countdown/index.vue";

import { ref } from "vue";

const openDrawer =ref(false); // 開啟抽屜

const OpenCtrlDrawer = async () => {
  openDrawer.value = true;
};

</script>

<style lang="scss" scoped>
// 佈局
#Home {
  padding: 20px;
  
}
// 組件
#Home {
  .row-item {
    display: flex;
    gap: 10px;
  }
}
</style>
