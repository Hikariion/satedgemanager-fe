<template>
    <div style="width: 200px; height: 100%;">

        <el-menu default-active="2" class="el-menu-vertical-demo" style="width: 175px; height: 100%; position:fixed;">
          <el-scrollbar style="height: 100%;">
          <div style="height: 50px; padding: 14px;padding-left: 20px; font-weight: bold; font-size:medium;color:dodgerblue;">
            星载边缘节点在轨计算管理系统
          </div>

          <el-menu-item index="overview" @click="gotoHome" style="margin-top: 15px;">
            <span slot="title">概览</span>
          </el-menu-item>

          <el-submenu index="resource">
            <span slot="title">节点管理</span>
            <el-menu-item index="edge-node" @click="gotoEdgeNode">节点</el-menu-item>
            <!-- <el-menu-item index="storage" @click="gotoStorageManagement">存储</el-menu-item> -->
<!--            <el-menu-item index="network" @click="gotoWebManagement">网络</el-menu-item>-->
          </el-submenu>

          <el-submenu index="virtual_resource">
            <span slot="title">虚拟资源</span>
            <el-menu-item index="Pod-management" @click="gotoPodManagement">容器</el-menu-item>
<!--             <el-menu-item index="VirtualMechine-management" @click="gotoVMManagement">虚拟机</el-menu-item>-->
          </el-submenu>

          <el-submenu index="application">
            <span slot="title">应用管理</span>
<!--            <el-menu-item index="Deployment-management" @click="gotoDeploymentManagement">在线任务</el-menu-item>-->
            <el-menu-item index="Job-management" @click="gotoJobManagement">离线任务</el-menu-item>
            <el-menu-item index="StreamingTask-management" @click="gotoStreamingTask">流式计算任务</el-menu-item>
          </el-submenu>



          <el-menu-item index="image"  @click="gotoImageManagement">
            <span slot="title">镜像管理</span>
          </el-menu-item>

          <el-menu-item index="user" @click="gotoUserManagement">
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="logs" @click="gotoLogManagement">
            <span slot="title">日志管理</span>
          </el-menu-item>
        </el-scrollbar>
    </el-menu>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export default {
    data() {
        return{

        }
    },
    methods:{
        gotoHome(){
            this.$router.push({
                name:'home'
            })
        },
        gotoEdgeNode(){
            this.$router.push({
                name:'node'
            })
        },
        gotoJobManagement(){
            this.$router.push({
                name:'job'
            })
        },
        gotoPodManagement(){
            this.$router.push({
                name:'pod'
            })
        },
        gotoDeploymentManagement(){
          this.$router.push({
            name:'deployment'
          })
        },
        gotoImageManagement(){
          this.$router.push({
            name: 'image'
          })
        },
        gotoUserManagement(){
          this.$router.push({
            name: 'user'
          })
        },
        gotoLogManagement(){
          this.$router.push({
            name:'log'
          })
        },
        gotoStorageManagement(){
          this.$router.push({
            name:'storage'
          })
        },
        gotoVMManagement(){
          this.$router.push({
            name: 'vm'
          })
        },
        gotoWebManagement(){
          this.$router.push({
            name:'service'
          })
        },
        gotoStreamingTask(){
          this.$router.push({
            name:'streamingtask'
          })
        }

    },
    mounted() {
       const container = document.querySelector('.scroll-container')
       this.ps = new PerfectScrollbar(container)
    },
    beforeDestroy(){
      this.ps.destroy()
    }
}
</script>

<style scoped>

</style>
