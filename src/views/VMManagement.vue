<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%;">虚拟机管理</el-header>
        </el-container>
        <div class="interface">
            <el-card class="user-list" style="display: inline-block;">
                <div class="wrapper">
                    
                    <!-- <el-input v-model="SearchNode" placeholder="按名称搜索" style="width: 400px;">
                        <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input> -->
                </div>
                <div class="table">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="VMname" label="虚拟机" width="200px">{{ tableData[0].VMname }}</el-table-column>
                        <el-table-column prop="type" label="类型"  style="width: 100px;">{{ tableData[0].type }}</el-table-column>
                        <el-table-column prop="description" label="描述" width="300px">{{ tableData[0].description }}</el-table-column>
                        <el-table-column prop="createtime" label="创建时间" width="300px">{{ tableData[0].createtime }}</el-table-column>
                        <el-table-column prop="operation" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                <el-dropdown style="font-size: smaller; left: 5px;">
                                    <span class="el-dropdown-link">
                                        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>功能x</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage1"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="100">
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
            currentPage1:1,
            tableData: [{
                VMname:'test11',
                type: '',
                description:'xxx',
                createtime:'2023-8-22 19:30:23',
                }]
        }
    },
    methods:{
        
    }
}
</script>

<style scoped>
.interface{
  height: 100%;
  background-color: #F2F6FC;
  position: fixed;
  width: 90%;
}

.user-list{
  position: relative;
  width: 92%;
  padding: 10px;
  top:30px;
  left:2%;
  right: 2%;
}
.table{
    top:20px;
    margin-bottom: 40px;
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