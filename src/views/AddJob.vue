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
                        <el-input v-model="form.job_name"></el-input>
                    </el-form-item>
                  <el-form-item label="经度">
                    <el-input v-model="form.lon"></el-input>
                  </el-form-item>
                  <el-form-item label="纬度">
                    <el-input v-model="form.lat"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="generateRandomCoordinates">生成随机经纬度</el-button>
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


                  <el-form-item label="选择文件">
                    <el-upload
                      action="null"
                      class="upload_wrap"
                      accept=".txt,.png,.jpg,.jpeg"
                      :on-remove="handleRemove"
                      :on-change="handleChange"
                      :file-list="fileList"
                      :auto-upload="false"
                      list-type="text"
                      :multiple="false"
                    >
                    <el-button size="small" type="primary">点击选择文件</el-button>
                    <template v-slot:tip>
                      <div class="el-upload__tip">只能上传.txt/.png/.jpg文件</div>
                    </template>
                    </el-upload>
                  </el-form-item>

                    <el-form-item>
                        <el-button type="success" @click="SubmitJob(form, fileList)">立即创建</el-button>

                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
import urlJoin from 'url-join'

export default {
    data() {
        return{
            form: {
                job_name: '',
                image_name:'',
                lon: '',
                lat: '',
            },
            fileList: [] // 本地文件列表变量
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
            {"value":"pi"},
            {"value": "sum-numbers"}
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
      },

      async SubmitJob(form, fileList) {
        const submitJobUrl = 'http://localhost:5000/submit_job'
        const imageRepo = 'harbor.act.buaa.edu.cn/sat-demo-jobs'

        // Check for required fields
        if (!form.job_name || !form.image_name || !form.lon || !form.lat || fileList.length === 0) {
          this.$message.error('所有字段必须填写');
          return;
        }

        // Validate longitude and latitude
        const lon = parseFloat(form.lon);
        const lat = parseFloat(form.lat);
        if (isNaN(lon) || lon < -180 || lon > 180 || isNaN(lat) || lat < -90 || lat > 90) {
          this.$message.error('经纬度必须是有效值，纬度范围为-90到90，经度范围为-180到180');
          return;
        }

        // Create form data
        let formData = new FormData();
        if (fileList.length > 0) {
          // Append file to form data if it exists
          formData.append('file', fileList[0].raw);
        } else {
          this.$message.error('必须上传一个文件');
          return;
        }

        // Append JSON data to form data
        const reqData = {
          job_name: form.job_name,
          image_name: urlJoin(imageRepo, form.image_name),
          lon: form.lon,
          lat: form.lat,
        };

        formData.append('req', JSON.stringify(reqData));

        // POST request with form data
        try {
          const response = await fetch(submitJobUrl, {
            method: 'POST',
            body: formData,
            mode: 'cors', // This will allow to send cross-origin requests
            // If you need to include credentials such as cookies with the request, add the following line:
            // credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          if (responseData.status === 'success') {
            this.$message.success('任务创建成功');
            this.$router.push({
              name: 'job'
            })
          } else {
            this.$message.error('任务创建失败');
          }
        } catch (error) {
          console.error('提交任务失败:', error);
          this.$message.error('提交任务时发生错误');
        }
      },

      generateRandomCoordinates(){
        // 经度范围从-180到180
        this.form.lon = (Math.random() * 360 - 180).toFixed(6);
        // 纬度范围从-90到90
        this.form.lat = (Math.random() * 180 - 90).toFixed(6);
      },
      handleRemove(file, fileList) {
        this.fileList = fileList;
      },
      beforeUpload() {
        // 返回false阻止文件自动上传
        return false;
      },
      handleChange(file,fileList) {
          if (fileList.length > 0) {
            this.fileList=[]
            this.fileList.push(file)
          }
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
