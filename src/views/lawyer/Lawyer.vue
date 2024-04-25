<template>
  <!-- banner -->
  <div class="banner" :style="cover">
    <h1 class="banner-title">律师</h1>
  </div>
  <!-- 律师列表 -->
  <v-card class="lawyer-container">
    <div class="flex flex-wrap gap-4">
      <el-card shadow="hover"  v-for="item in lawyerList" style="margin-bottom: 10px;border-radius: 10px">
        <v-row>
          <v-col cols="6" style="padding: 0px;display: flex;align-items: center">
            <el-avatar :size="40"
                       :src="item.avatar"/>
            <div class="lawyer_info">
              <div class="lawyer_name">
                <span>
                  {{item.name}}律师
                  <el-tag type="danger">
                    认证律师
                  </el-tag>
                  <i class="iconfont icondianzan" style="margin-left: 10px;cursor: pointer" />
                  <span class="likeCount" style="color: red;font-size: 13px;font-weight: bold">{{item.likeCount ? item.likeCount : 0}}</span>
                </span>
              </div>
              <div class="lawyer_details">
                <span style="font-size: 12px">
                  {{item.school}}/{{item.qualification}}/{{item.major}}
                </span>
              </div>
            </div>
          </v-col>
          <v-col cols="6" style="padding: 0px;display: flex;align-items: center;justify-content: right">
            <el-button type="success" style="margin-right: 20px;">咨询</el-button>
          </v-col>
        </v-row>
      </el-card>
    </div>
  </v-card>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import store from "@/store";
import {getHomeLawyer} from "@/network/lawyer";
import {ElMessage} from "element-plus";

export default {
  name: "Lawyer",
  setup() {
    let lawyerList = ref([])
    let pageInfo = reactive({
      current:1,
      size:10
    })
    const getLawyerList = () => {
      getHomeLawyer(pageInfo).then(res=>{
        if (res.flag){
          lawyerList.value = res.data.recordList
        }else {
          ElMessage.error("出错了")
        }
      })
    }
    const cover = computed(() => {
      let cover = "";
      store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "lawyer") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    })
    onMounted(()=>{
      getLawyerList()
    })
    return {
      cover,
      lawyerList,
    }
  },
}
</script>

<style scoped>
.lawyer_info {
  margin-left: 10px;
}
</style>