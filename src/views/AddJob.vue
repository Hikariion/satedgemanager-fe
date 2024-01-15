<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%; display: flex;">
                <div style="margin-top: -5px;">
                    <el-button icon="el-icon-back" plain @click="goBack"></el-button>
                </div>
                <div style="margin-top: 10px; margin-left: 20px;">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/job' }">离线任务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>创建离线任务</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-header>
        </el-container>
        <div class="interface">
            <el-card class="add-job">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="任务名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="重试次数">
                        <el-input v-model="form.back_off_limit"></el-input>
                    </el-form-item>
                    <el-form-item label="镜像名称">
                        <el-autocomplete
                        class="inline-input"
                        v-model="form.image_name"
                        :fetch-suggestions="querySearch"
                        placeholder="请选择镜像"
                        @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>

                  <el-form-item label="上传文件">
                    <el-upload
                      class="upload-demo"
                      action="https://example.com/upload"
                      accept=".txt,image/png,image/jpeg"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-upload="beforeUpload"
                      :on-success="handleSuccess"
                      :on-error="handleError"
                      multiple
                      list-type="text">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.txt/.png/.jpg文件</div>
                    </el-upload>
                  </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="SubmitCreateJob(form)">立即创建</el-button>

                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            form: {
                name: '',
                back_off_limit: '',
                image_name:'',
            }
        }
    },
    methods:{
        handleSelect(item) {
        this.form.image_name = item.value;
      },
        querySearch(queryString, cb) {
        var images = this.images;
        var results = queryString ? images.filter(this.createFilter(queryString)) : images;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (images) => {
          return (images.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll(){
        return[
            {"value":"hw-py"},
            {"value":"pi"}
        ]
      },
        goBack(){
            this.$router.push({
                name:'job'
            })
        },
        SubmitCreateJob(form){
            console.log(form.image_name)
            var JsonData = JSON.stringify(form)
            this.form.back_off_limit = parseInt(this.form.back_off_limit)
            console.log(JsonData)
            this.$http.post('/job/create', form).then(res =>{
                console.log(res)
                if(res.data.status == '0'){
                    this.$message.success('添加成功')
                    this.form.name = '';
                    this.form.back_off_limit = ''
                    this.form.image_name = ''

                    this.$router.push({
                        name:'job'
                    })
                }else if(res.data.status == '1'){
                    this.$message.error('添加失败')
                    this.form.name = '';
                    this.form.back_off_limit = ''
                    this.form.image_name = ''

                }

            })
        }

    },
    mounted(){
        this.images = this.loadAll()
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
.add-job{
  position: relative;
  width: 92%;
  padding: 10px;
  top:30px;
  left:2%;
  right: 2%;
}


</style>
