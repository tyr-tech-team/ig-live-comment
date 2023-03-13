<template lang="pug">
//- 請填寫功能描述👈
#Home
  FbCtrlsDrawer(v-model:isOpen="openDrawer")
  aButton(type="primary" @click="OpenCtrlDrawer") {{"FB 控制項"}}
</template>

<script setup>
import FbCtrlsDrawer from "@/components/fb-ctrls-drawer/index.vue";
import { ref } from "vue";

const openDrawer =ref(false); // 開啟抽屜

const OpenCtrlDrawer = async () => {
  openDrawer.value = true;
};

</script>

<style lang="scss" scoped>
// 佈局
#Home {
  padding: 5px;
  
}
// 組件
#Home {
}
</style>
