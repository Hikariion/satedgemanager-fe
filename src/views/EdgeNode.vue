<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%;">节点</el-header>
        </el-container>
        <div class="interface">
            <el-card class="node-list" style="display: inline-block;">
                <div class="wrapper">
                    <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddEdgeNode">添加节点</el-button> -->
                    <span style="top: -10px; font-size: large;">节点列表</span>
                    <!-- <el-input v-model="SearchNode" placeholder="按名称搜索" style="width: 400px;">
                        <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input> -->
                </div>
                <div class="table">
                    <el-table :data="displayedData" stripe style="width: 100%">
                        <el-table-column prop="name" label="节点名称">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="gotoNode(scope.row.name)">{{ scope.row.name }}</el-button>
                            </template>
                        </el-table-column>
                         <el-table-column prop="ip" label="IP"></el-table-column>
                        <el-table-column prop="create_time" label="上线时间" ></el-table-column>
                        <el-table-column prop="roles" label="所属集群"></el-table-column>
                        <el-table-column prop="cpu_cores" label="CPU核心数" ></el-table-column>

                        <el-table-column prop="memory" label="内存" >
                            <template slot-scope="scope">
                                {{ scope.row.memory }} G
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="memory_avaliable" label="可用内存" ></el-table-column> -->
                        <el-table-column prop="disk" label="存储容量" >
                            <template slot-scope="scope">
                                {{ scope.row.disk }} G
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

            tableData: [

            ],
            displayedData:[], //当页展示的数据
            pageSize:10,
            currentPage1:1, //当前页码
            datasize:0
        }
    },
    methods:{
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
        toAddEdgeNode(){
            this.$router.push({
                name:'addnode'
            })
        },
        gotoNode(name){
            this.$router.push({
                name:'nodeinfo',
                params:{ name: name }
            })

        },
        getNodes(){
            this.$http.get('/node/info').then(res => {
                console.log(res.data.data.nodes)
                // this.tableData = res.data.data.nodes
                for(var i = 0;i<res.data.data.nodes.length;i++){
                    res.data.data.nodes[i].gpu = res.data.data.nodes[i].gpu ? '√':'×'
                    res.data.data.nodes[i].npu = res.data.data.nodes[i].npu ? '√':'×'
                    this.tableData.push(res.data.data.nodes[i])
                }
                console.log(this.tableData[0].name)
                this.datasize = res.data.data.nodes.length
                this.updateDisplayedData()
            })
        }
    },
    mounted() {
        this.getNodes();

    },
}
</script>

<style scoped>
.interface{
  height: 100%;
  background-color: #F2F6FC;
  width:100%;
}

.node-list{
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
