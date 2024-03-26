<template>
  <div>
    <el-container>
      <div>
        <el-header style="height: 60px; padding: 15px; width: 100%;">概览</el-header>
      </div>
      <div style="left: 85%;margin-top: 5px;">
        <el-button icon="el-icon-switch-button" style="float: right;" type="text" @click="quit()"> 退出登录</el-button>
      </div>

    </el-container>
    <div class="interface">
      <el-card class="function-box" >
        <div slot="header" class="clearfix">
          <span>功能快速入口</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作指南</el-button> -->
        </div>
        <div style="display: flex; justify-content:space-around; flex-wrap: wrap;margin: 0 -10px; top:30px">
          <div class="text-item" v-for="item in functionlist" :key="item" @click="gotoPage(item.name)">
            <el-card  shadow="hover" style="width:150px" >
            <div style="text-align: center;">
              <img :src="item.src" width="70px" >
            </div>
            <div style="text-align: center;">
              {{item.name}}
            </div>
          </el-card>
          </div>
        </div>
      </el-card>

<!--      <el-card class="resource-overview" >-->
<!--        <div class="clearfix">-->
<!--          <span>资源总览</span>-->
<!--        </div>-->
<!--        <el-card shadow="never" class="resource-inner">-->
<!--          <div style="display:flex; justify-content: space-around;">-->
<!--              <div v-for="item in resource_overview_list" :key="item" >-->
<!--                <div style="font-size:medium; margin-left: -15px;">-->
<!--                  {{ item.name }}-->
<!--                </div>-->
<!--                <div style="color: dodgerblue; font-size: 35px; margin-top: 5px;" >-->
<!--                  {{item.data}}-->
<!--                  <span style="font-size: small;">个</span>-->
<!--                </div>-->
<!--              </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-card>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return{
      select_node:'',
      select_app:'',
      functionlist:[
        {
          name:"节点管理",
          src: require('../assets/addedge.png')
        },
        // {
        //   name:"注册边缘设备",
        //   src: require('../assets/createDevice.png')
        //   // src:"https://ecloud.10086.cn/api/page/edge/img/createDevice.9bd71976.svg"
        // },
        {
          name:"虚拟资源",
          src: require('../assets/addedge.png')
          // src:"https://ecloud.10086.cn/api/page/edge/img/createApp.8d1993fe.svg"
        },{
          name:"应用管理",
          src: require('../assets/createApp.png')
          // src:"	https://ecloud.10086.cn/api/page/edge/img/mesConfig.62060e0a.svg"
        },
        {
          name:"镜像管理",
          src: require('../assets/mesConfig.png')
        },
        // {
        //   name:"注册边缘设备",
        //   src: require('../assets/createDevice.png')
        //   // src:"https://ecloud.10086.cn/api/page/edge/img/createDevice.9bd71976.svg"
        // },
        {
          name:"用户管理",
          src: require('../assets/createDevice.png')
          // src:"https://ecloud.10086.cn/api/page/edge/img/createApp.8d1993fe.svg"
        },{
          name:"日志管理",
          src: require('../assets/fix_img.png')
          // src:"	https://ecloud.10086.cn/api/page/edge/img/mesConfig.62060e0a.svg"
        },
      ],
      resource_overview_list:[{
          name:"边缘节点",
          data:4
        },{
          name:"离线任务数量",
          data:1
        },{
          name:"容器数量",
          data:5
        }
      ],

    }
  },
  methods:{
    quit(){
      sessionStorage.clear()
      this.$parent.ifLogin=false
      this.$router.push({
          name:'login'
      })
    },

    gotoPage(name){

      if(name=='资源管理'){
        this.$router.push({
          name:'node'
        })
      }else if(name =="虚拟资源"){
        this.$router.push({
          name:'pod'
        })
      }else if(name =="应用管理"){
        this.$router.push({
          name:'deployment'
        })
      }else if(name == "镜像管理"){
        this.$router.push({
          name:'image'
        })
      }else if(name == "用户管理"){
        this.$router.push({
          name:'user'
        })
      }else if(name =="日志管理"){
        this.$router.push({
          name:'log'
        })
      }
    },
    getAllInfo(){
      this.$http.post('/overview/info').then(res =>{

        this.resource_overview_list[0].data = res.data.data.node_count
        this.resource_overview_list[1].data = res.data.data.job_count
        this.resource_overview_list[2].data = res.data.data.pod_count
      })
    }

  },
  mounted() {
    console.log(process.env)
    this.getAllInfo()
  },
  watch:{

    },



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
    color: #333;
  }

.clearfix{
  position: relative;
  margin-top: -10px;
  font-size: medium
}
.interface{
  height: 100%;
  width: 100%;
  background-color: #F2F6FC;
}

.function-box{
  position: relative;
  width: 96%;
  padding: 10px;
  top:30px;
  left:2%;
  right: 2%;
  height: 470px;
}

.resource-overview{
  position: relative;
  width: 96%;
  padding: 10px;
  margin-top:100px;
  left:2%;
  right: 2%;
  height: 320px;
  bottom: 30px;

}
.resource-inner{
  position: relative;
  width: 96%;
  padding: 0px;
  margin-bottom: 10px;
  top:70px;
  left:2%;
  right: 2%;
}

.resource-monitor{
  position: relative;
  width: 96%;
  padding: 0px;
  margin-top:50px;
  bottom: 20px;
  left:2%;
  right: 2%;
}

.gpu_list{
  position: relative;
  width: 96%;
  padding: 0px;
  margin-top:50px;
  bottom: 20px;
  left:2%;
  right: 2%;
}

.text-item{
  width: 150px;
  flex: 0 0 calc(33.33% - 10px);
  margin: 5px; /* 外边距，用于控制卡片之间的间距 */
  display: flex;
  justify-content:space-around;
  margin-bottom: 20px;
}
</style>
