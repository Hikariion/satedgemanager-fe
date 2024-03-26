<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%;">离线任务管理</el-header>
        </el-container>
        <div class="interface">
            <el-card class="job-list" style="display: inline-block;">
                <div class="wrapper">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddJob">创建任务</el-button>
                    <el-button type="primary" @click="reFlush">刷新</el-button>
                    <!-- <el-input v-model="SearchNode" placeholder="按名称搜索" style="width: 400px;">
                        <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input> -->
                </div>
                <div class="table">
                    <el-table :data="displayedData" stripe style="width: 100%">
                        <el-table-column prop="job_name" label="任务名"></el-table-column>
                        <el-table-column prop="job_id" label="任务Id"></el-table-column>
                        <el-table-column prop="image_name" label="镜像名"></el-table-column>
<!--                        <el-table-column prop="image_url" label="镜像url" ></el-table-column>-->
                        <el-table-column prop="create_time" label="创建时间(UTC)"></el-table-column>
                        <el-table-column prop="phase" label="状态" >
<!--                            <template slot-scope="scope">-->
<!--                                <el-tag style="size:smaller"-->
<!--                                :type=" scope.row.status  === 'Complete' ? 'success' : 'primary'"-->
<!--                                disable-transitions>{{ scope.row.status }}</el-tag>-->
<!--                            </template>-->
                        </el-table-column>
                      <el-table-column prop="output" label="返回结果" ></el-table-column>
<!--                        <el-table-column label="操作">-->
<!--                            <template slot-scope="scope">-->

<!--                                <el-button v-if="role" size="mini" type="text" @click="deleteJob(scope.row.name)">删除</el-button>-->
<!--                                <el-button v-if="!role" size="mini" type="text" @click="deleteJob(scope.row.name)" disabled>删除</el-button>-->
<!--                                &lt;!&ndash; <el-dropdown style="font-size: smaller; left: 5px;" >-->
<!--                                    <span class="el-dropdown-link">-->
<!--                                        下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                                    </span>-->
<!--                                    <el-dropdown-menu slot="dropdown">-->

<!--                                        <el-dropdown-item>功能x</el-dropdown-item>-->
<!--                                    </el-dropdown-menu>-->
<!--                                </el-dropdown> &ndash;&gt;-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage1"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="datasize">
                    </el-pagination>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>


export default {
    data() {
        return{
            role:false,
            displayedData:[], //当页展示的数据
            pageSize:10,
            currentPage1:1, //当前页码
            datasize:0,
            tableData: []
        }
    },
    methods:{
        IsAdmin(){
            this.role = sessionStorage.getItem('role')=='admin' ? true:false
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.updateDisplayedData(); // 重新加载数据
        },
        handleCurrentChange(val) {
            this.currentPage1 = val;
            this.updateDisplayedData(); // 重新加载数据
        },
        updateDisplayedData(){
            const startIndex = (this.currentPage1 - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            this.displayedData = this.tableData.slice(startIndex, endIndex);
        },
        getAllJobs(){
            this.$http.post('/job/info').then(res =>{
                console.log(res)
                this.tableData = res.data.data.jobs
                // console.log(this.tableData)
                this.datasize = res.data.data.jobs.length
                this.updateDisplayedData()
            })
        },
        getComputeJobs() {
          let computeJobInfoUrl = 'http://localhost:5000/get_all_job_info'
          this.$http.get(computeJobInfoUrl, { crossDomain: true }).then(res => {
            console.log(res)

            this.tableData = res.data
            this.datasize = res.data.length

            this.tableData = this.tableData.map(item => {
              if (item.image_name.includes('/')) {
                // Split the image_name by '/' and keep the last part
                item.image_name = item.image_name.split('/').pop();
              }
              return item;
            });

            this.updateDisplayedData()

          }).catch(error => {
            // Handle any errors here
            console.error('There was an error fetching the compute jobs:', error);
          });
        },
        toAddJob(){
            this.$router.push({
                name: 'addjob'
            })
        },
        deleteJob(name){
            let obj = {"name":name}
            this.$http.post('/job/delete', obj).then(res =>{
                console.log(res)
                if(res.data.status === 0){
                    this.$message.success('删除成功')
                    location.reload()
                }
            })
        },
      reFlush() {
          console.log("re flush");
          this.getComputeJobs();
      }
    },
    mounted() {
        // this.getAllJobs();
        this.getComputeJobs();
    },
    created(){
        this.IsAdmin()
    }
}
</script>

<style scoped>
.interface{
  height: 100%;
  background-color: #F2F6FC;

  width: 100%;
}

.job-list{
    position: relative;
  width: 96%;
  padding: 10px;
  top:30px;
  left:2%;
  right: 2%;
  margin-bottom:5%;
  min-height: 800px;
}
.table{
    top:20px;
    margin-bottom: 40px;
    min-height: 600px;
}
.wrapper{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
