<template>
  <div>
    <div class="banner" :style="cover">
      <h1 class="banner-title">律师认证</h1>
    </div>
    <v-card class="blog-container">
      <v-form ref="form">
        <div>
          <span class="info-title">认证资料</span>
        </div>
        <div style="margin-top: 70px">
          <el-icon><UserFilled /></el-icon>
          <span>基本信息</span>
        </div>
        <el-divider></el-divider>
        <v-row class="info-wrapper">
          <v-col md="6" sm="12" cols="6">
            <v-text-field
                variant="underlined"
                v-model="name"
                :disabled="status==1 || status==2"
                prepend-inner-icon="mdi-account-circle"
                label="姓名"
                placeholder="请输入您的姓名"
            />
          </v-col>
          <v-col md="6" sm="12" cols="6">
            <v-text-field
                variant="underlined"
                v-model="phone"
                :disabled="status==1 || status==2"
                prepend-inner-icon="mdi-phone"
                label="电话"
                placeholder="请输入您的手机号"
            />
          </v-col>
        </v-row>
        <div style="margin-top: 50px">
          <el-icon><UserFilled /></el-icon>
          <span>实名认证</span>
        </div>
        <el-divider></el-divider>

        <v-row class="info-wrapper">
          <v-col md="6" sm="12" cols="6">
            <v-text-field
                variant="underlined"
                v-model="idCard"
                :disabled="status==1 || status==2"
                label="身份证号"
                prepend-inner-icon="mdi-card-account-details"
                placeholder="请输入身份证号"
            />
            <v-text-field
                variant="underlined"
                v-model="qualification"
                :disabled="status==1 || status==2"
                prepend-inner-icon="mdi-school"
                label="学历"
                placeholder="请输入您的学历"
            />
          </v-col>
          <v-col md="6" sm="12" cols="6">
            <v-text-field
                variant="underlined"
                v-model="school"
                :disabled="status==1 || status==2"
                prepend-inner-icon="mdi-library"
                label="学校"
                placeholder="请输入您的学校"
            />
            <v-text-field
                variant="underlined"
                v-model="major"
                :disabled="status==1 || status==2"
                prepend-inner-icon="mdi-school"
                label="专业"
                placeholder="请输入您的专业"
            />
          </v-col>
        </v-row>
        <div style="margin-top: 50px">
          <el-icon><CameraFilled /></el-icon>
          <span>实名认证(请上传身份证正反面)</span>
        </div>
        <el-divider></el-divider>
        <v-row class="info-wrapper">
          <v-col md="6" sm="12" cols="6">
            <el-upload
                v-model:file-list="idCardList"
                action="https://legaladvice.oss-cn-beijing.aliyuncs.com/"
                list-type="picture-card"
                :disabled="status == 1 || status == 2"
                :data="ossData"
                :before-upload="card_upload"
                :on-success="upload_card_success"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </v-col>
        </v-row>
        <div style="margin-top: 50px">
          <el-icon><Stamp /></el-icon>
          <span>律师执业证书</span>
        </div>
        <el-divider></el-divider>
        <v-row class="info-wrapper">
          <v-col md="6" sm="12" cols="6">
            <el-upload
                v-model:file-list="lpcList"
                action="https://legaladvice.oss-cn-beijing.aliyuncs.com/"
                list-type="picture-card"
                :disabled="status == 1 || status == 2"
                :data="ossData"
                :before-upload="lpc_upload"
                :on-success="upload_lpc_success"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </v-col>
        </v-row>
        <div style="margin-top: 50px">
          <el-icon><Stamp /></el-icon>
          <span>律师职业资格证书</span>
        </div>
        <el-divider></el-divider>
        <v-row class="info-wrapper">
          <v-col md="6" sm="12" cols="6">
            <el-upload
                v-model:file-list="lpqcList"
                action="https://legaladvice.oss-cn-beijing.aliyuncs.com/"
                list-type="picture-card"
                :disabled="status == 1 || status == 2"
                :data="ossData"
                :before-upload="lpqc_upload"
                :on-success="upload_lpqc_success"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </v-col>
        </v-row>
        <el-divider></el-divider>
        <div v-if="status == 3">
          <span style="color: red;font-size: 12px">注:{{ remarks }}</span>
        </div>
        <div style="margin-top: 20px;display: flex;float: right" v-if="status== 0 || status == 3">
          <el-button @click="authentication" >申请认证</el-button>
        </div>
        <div style="margin-top: 20px;display: flex;float: right" v-if="status==1">
          <el-button disabled type="success">审核通过无需重复提交</el-button>
        </div>
        <div style="margin-top: 20px;display: flex;float: right" v-if="status==2">
          <el-button disabled type="warning">审核中...</el-button>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {userInfoUpdate} from "@/network/login";
import {ElMessage} from "element-plus";
import {getPolicy} from "@/network/system";
import {v4} from "uuid";
import {getLawyerAuthInfo, lawyerAuth} from "@/network/lawyer";
import router from "@/router";

export default {
  components: {AvatarCropper},
  setup() {
    let stat = reactive({
      idCard:"",
      name:"",
      major:"",
      school:"",
      phone:"",
      qualification: "",
      status: 0,
      remarks: "",
    })
    //请求oss 数据
    let ossData = {
      key: '',
      policy: '',
      OSSAccessKeyId: '',
      signature: '',
    }
    let idCardList = ref([])
    let lpcList = ref([])
    let lpqcList = ref([])
    //实名认证上传前
    const card_upload = (file) => {
      let type = file.name.split(".")
      type = type[type.length - 1]
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('最大支持 10MB 文件')
        return Promise.reject('最大支持 10MB 文件')
      }
      let fileName = v4() + "." + type
      return new Promise((resolve, reject) => {
        getPolicy({path: 'idCard'}).then(res => {
          ossData.signature = res.data.signature
          ossData.policy = res.data.policy
          ossData.OSSAccessKeyId = res.data.accessKeyId
          ossData.key = res.data.dir + fileName
        })
        setTimeout(() => {
          resolve(file)
        }, 2000)
      })
    }
    //实名认证上传成功
    const upload_card_success = (a,file,b) => {
      let baseUrl = "https://legaladvice.oss-cn-beijing.aliyuncs.com/"
      file.name = baseUrl+ossData.key
    }
    //lpc认证上传前
    const lpc_upload = (file) => {
      let type = file.name.split(".")
      type = type[type.length - 1]
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('最大支持 10MB 文件')
        return Promise.reject('最大支持 10MB 文件')
      }
      let fileName = v4() + "." + type
      return new Promise((resolve, reject) => {
        getPolicy({path: 'lpcAuth'}).then(res => {
          ossData.signature = res.data.signature
          ossData.policy = res.data.policy
          ossData.OSSAccessKeyId = res.data.accessKeyId
          ossData.key = res.data.dir + fileName
        })
        setTimeout(() => {
          resolve(file)
        }, 2000)
      })
    }
    //lpc认证上传成功
    const upload_lpc_success = (a,file,b) => {
      let baseUrl = "https://legaladvice.oss-cn-beijing.aliyuncs.com/"
      file.name = baseUrl+ossData.key
    }
    //lpqc认证上传前
    const lpqc_upload = (file) => {
      let type = file.name.split(".")
      type = type[type.length - 1]
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('最大支持 10MB 文件')
        return Promise.reject('最大支持 10MB 文件')
      }
      let fileName = v4() + "." + type
      return new Promise((resolve, reject) => {
        getPolicy({path: 'lpqcAuth'}).then(res => {
          ossData.signature = res.data.signature
          ossData.policy = res.data.policy
          ossData.OSSAccessKeyId = res.data.accessKeyId
          ossData.key = res.data.dir + fileName
        })
        setTimeout(() => {
          resolve(file)
        }, 2000)
      })
    }
    //lpqc认证上传成功
    const upload_lpqc_success = (a,file,b) => {
      let baseUrl = "https://legaladvice.oss-cn-beijing.aliyuncs.com/"
      file.name = baseUrl+ossData.key
    }
    //申请认证
    const authentication = () => {
      let idCardRex = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      let phoneRex = /^1[3456789]\d{9}$/
      if (!phoneRex.test(stat.phone)){
        ElMessage.error("手机号格式不正确")
        return false
      }
      if (!idCardRex.test(stat.idCard)){
        ElMessage.error("身份证格式不正确")
        return false
      }
      if (idCardList.value.length == 0 || lpqcList.value.length == 0 || lpcList.value.length == 0){
        ElMessage.error("请上传认证资料(身份证正反面、律师执业证书、律师执业资格证书)")
        return false
      }
      let data = {
        idCard: stat.idCard,
        name: stat.name,
        major: stat.major,
        school: stat.school,
        phone: stat.phone,
        qualification: stat.qualification,
      }
      if (stat.id != null){
        data.id = stat.id
      }
      let idCardString = '['
      idCardList.value.map(i=>{
        idCardString = idCardString + i.name + ','
      })
      idCardString = idCardString.substring(0,idCardString.length-1);
      idCardString += ']'

      let lpcString = '['
      lpcList.value.map(i=>{
        lpcString = lpcString + i.name + ','
      })
      lpcString = lpcString.substring(0,lpcString.length-1);
      lpcString += ']'

      let lpqcString = '['
      lpqcList.value.map(i=>{
        lpqcString = lpqcString + i.name + ','
      })
      lpqcString = lpqcString.substring(0,lpqcString.length-1);
      lpqcString += ']'

      data.idCardAuth = idCardString
      data.lpc = lpcString
      data.lpqc = lpqcString
      data.status = 2
      lawyerAuth(data).then(res=>{
        if (res.flag){
          ElMessage.success("申请成功,待审核中...")
          router.push("setting")
        }else {
          ElMessage.error("出错了,请重试")
        }
      })
    }
    const cover = computed(() => {
      let cover = "";
      store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "user") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    })
    onMounted(()=>{
      getLawyerAuthInfo().then(res=>{
        let arr = []
        if (res.flag){
          stat.id = res.data.id
          stat.idCard = res.data.idCard
          stat.name = res.data.name
          stat.status = res.data.status
          stat.major = res.data.major
          stat.school = res.data.school
          stat.phone = res.data.phone
          stat.qualification = res.data.qualification
          stat.remarks = res.data.remarks
          arr = res.data.idCardAuth.slice(1,-1).split(",")
          arr.map(i=>{
            idCardList.value.push({name:i,url:i})
          })
          arr = res.data.lpc.slice(1,-1).split(",")
          arr.map(i=>{
            lpcList.value.push({name:i,url:i})
          })
          arr = res.data.lpqc.slice(1,-1).split(",")
          arr.map(i=>{
            lpqcList.value.push({name:i,url:i})
          })
        }
      })
    })
    return {
      ...toRefs(stat),
      cover,
      idCardList,
      lpcList,
      lpqcList,
      ossData,
      card_upload,
      upload_card_success,
      lpc_upload,
      upload_lpc_success,
      lpqc_upload,
      upload_lpqc_success,
      authentication,
    }
  },

};
</script>

<style scoped>
.info-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.info-wrapper {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: left;
}

</style>
