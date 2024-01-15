<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%;">离线任务管理</el-header>
        </el-container>
        <div class="interface">
            <el-card class="job-list" style="display: inline-block;">
                <div class="wrapper">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddJob">创建任务</el-button>
                    <!-- <el-input v-model="SearchNode" placeholder="按名称搜索" style="width: 400px;">
                        <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input> -->
                </div>
                <div class="table">
                    <el-table :data="displayedData" stripe style="width: 100%">
                        <el-table-column prop="name" label="名称" width="150px"></el-table-column>
                        <el-table-column prop="image_name" label="镜像名称" ></el-table-column>
<!--                        <el-table-column prop="image_url" label="镜像url" ></el-table-column>-->

                        <el-table-column prop="status" label="状态"  style="width: 50px;">
                            <template slot-scope="scope">
                                <el-tag style="size:smaller"
                                :type=" scope.row.status  === 'Complete' ? 'success' : 'primary'"
                                disable-transitions>{{ scope.row.status }}</el-tag>
                            </template>
                        </el-table-column>
                      <el-table-column prop="output" label="返回结果" ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">

                                <el-button v-if="role" size="mini" type="text" @click="deleteJob(scope.row.name)">删除</el-button>
                                <el-button v-if="!role" size="mini" type="text" @click="deleteJob(scope.row.name)" disabled>删除</el-button>
                                <!-- <el-dropdown style="font-size: smaller; left: 5px;" >
                                    <span class="el-dropdown-link">
                                        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">

                                        <el-dropdown-item>功能x</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </template>
                        </el-table-column>
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
            tableData: [{
                name:'myjob',
                image_name:'',
                image_url:'',
                back_off_limit:'',
                status:''
                }]
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
        }
    },
    mounted() {
        this.getAllJobs();
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
