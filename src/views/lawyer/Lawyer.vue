<template>
  <!-- banner -->
  <div class="banner" :style="cover">
    <h1 class="banner-title">律师</h1>
  </div>
  <!-- 律师列表 -->
  <v-card class="lawyer-container">
  </v-card>
</template>

<script>
import {computed} from "vue";
import store from "@/store";

export default {
  name: "Lawyer",
  setup() {
    const cover = computed(()=>{
      let cover = "";
      store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "lawyer") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    })
    return{
      cover,
    }
  },
}
</script>

<style scoped>

</style>