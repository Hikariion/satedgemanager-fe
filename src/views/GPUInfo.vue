<template>
    <div>
        <el-container>
            <el-header style="height: 60px; padding: 15px; width: 100%; display: flex;">
                <div style="margin-top: -5px;">
                    <el-button icon="el-icon-back" plain @click="goBack"></el-button>
                </div>
                <div style="margin-top: 10px; margin-left: 20px;">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/node' }">节点</el-breadcrumb-item>
                        <el-breadcrumb-item>GPU</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-header>
        </el-container>
        <div class="interface">
            <el-card class="NodeInfoCard1">
                <el-descriptions title="节点信息">
                <el-descriptions-item label="当前频率">{{gpu_frequency_current}}</el-descriptions-item>
                <el-descriptions-item label="电源控制状态">{{  gpu_power_control_status }}</el-descriptions-item>
                <el-descriptions-item label="railgate状态">
                    <el-tag style="size:smaller"
                    :type=" gpu_railgate_status  === '开启' ? 'success' : 'danger'"
                    disable-transitions>{{ gpu_railgate_status }}</el-tag>
                </el-descriptions-item>
                
                <el-descriptions-item label="tpc pg mask状态">
                    <el-tag style="size:smaller"
                    :type=" gpu_tpc_pg_mask_statu  === '开启' ? 'success' : 'danger'"
                    disable-transitions>{{ gpu_tpc_pg_mask_status }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="3D缩放状态">
                    <el-tag style="size:smaller"
                    :type="  gpu_3d_scaling_status   === '开启' ? 'success' : 'danger'"
                    disable-transitions>{{ gpu_3d_scaling_status }}</el-tag>
                </el-descriptions-item>
                
            </el-descriptions>
            <div>
                <el-button size="mini" type="text" @click="gotoNodeLog()">查看节点日志</el-button>
            </div>
            </el-card>
            <el-card class="NodeInfoCard2">
                <template>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="进程信息" name="first">
                            <div style="left: 10px;">
                                <span>GPU进程列表</span>
                            </div>
                            <div style="display: flex; justify-content:space-around; margin-top: 20px;">
                                <el-table :data="gpu_process_info" stripe style="width: 100%">
                                    <el-table-column prop="command" label="命令" width="150px"></el-table-column>
                                    <el-table-column prop="container" label="容器" width="150px"></el-table-column>
                                    <el-table-column prop="namespace" label="命名空间" width="100px"></el-table-column>
                                    <el-table-column prop="cpu_mem" label="cpu_mem"  style="width: 100px;"></el-table-column>
                                    <el-table-column prop="job" label="job" width="100px"></el-table-column>
                                    <el-table-column prop="pid" label="pid" width="100px"></el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="监控" name="second" style="justify-content: center;">
                            <div style="display:flex; justify-content: space-around;">
                                <div id="GPU_load_history" style="width: 800px; height: 400px"></div>
                            </div>
                            <div style="display:flex; justify-content: space-around;">
                                <!-- <div id="GPU_load_chart" style="width: 380px; height: 300px; margin-top: 40px; left: -10px;"></div> -->
                                <div id="GPU_temperature_chart" style="width: 380px; height: 300px; margin-top: 40px; "></div>
                            </div>
                            
                           

                        </el-tab-pane>
                        <!-- <el-tab-pane label="设备" name="third">设备</el-tab-pane> -->
                    </el-tabs>
                </template>
            </el-card>
        </div>
    </div>

</template>

<script>

export default {
    data() {
        return{
            activeName: 'first',
            select_node:'',
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            CpuSeconds:{

            },
            
            GPU_load_data:[],
            GPU_load_data_time:[

            ],
            GPU_load_data_value:[

            ],
            gpu_temperature:'',
            gpu_load:'',
            gpu_frequency_current:'',
            gpu_power_control_status:'',
            gpu_railgate_status:'',
            gpu_tpc_pg_mask_status:'',
            gpu_3d_scaling_status:'',
            gpu_process_info:[]
        }
    },
    methods:{
        get_npu_flash_id(){
            let api = 'http://192.168.13.148:30039/api/v1/query?query=npu_flash_id{NPU_ID=%22'+this.Npu_Id+'%22}'
            this.$http.get(api).then(res =>{
                this.Npu_flash_id = res.data.data.result[0].value[1]
            })
        },
        get_gpu_frequency_current(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_frequency_current').then(res =>{
                this.gpu_frequency_current = res.data.data.result[0].value[1]
            })
        },
        get_gpu_power_control_status(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_power_control_status').then(res =>{
                this.gpu_power_control_status = res.data.data.result[0].value[1]
            })
        },
        get_gpu_railgate_status(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_railgate_status').then(res =>{
                if(res.data.data.result[0].value[1] == 1){
                    this.gpu_railgate_status = '开启'
                }else{
                    this.gpu_railgate_status = '关闭'
                }
            })
        },
        get_gpu_tpc_pg_mask_status(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_tpc_pg_mask_status').then(res =>{
                if(res.data.data.result[0].value[1] == 1){
                    this.gpu_tpc_pg_mask_status = '开启'
                }else{
                    this.gpu_tpc_pg_mask_status = '关闭'
                }
            })
        },
        get_gpu_3d_scaling_status(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_3d_scaling_status').then(res =>{
                if(res.data.data.result[0].value[1] == 1){
                    this.gpu_3d_scaling_status = '开启'
                }else{
                    this.gpu_3d_scaling_status = '关闭'
                }
            })
        },

        goBack(){
            this.$router.push({
                name:'node'
            })
        },
        gotoNodeLog(){
            this.$router.push({
                name: ''
            })
        },

        // TODO

        get_gpu_temperature(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=gpu_temperature').then(res =>{
                this.gpu_temperature = res.data.data.result[0].value[1]
                console.log("temperature"+this.gpu_temperature)
            })
        },

        get_gpu_load(){
            var timestamp_end = Date.parse(new Date().toUTCString())/1000;
            console.log(timestamp_end)
            var timestamp_start = timestamp_end - 600
            let api = 'http://192.168.13.147:30039/api/v1/query_range?query=gpu_load&start='+timestamp_start+'&end='+timestamp_end+'&step=1'
            console.log(api)
            this.$http.get(api).then(res =>{
                console.log(res)
                this.GPU_load_data = res.data.data.result[0].values
                    // 时间戳 
                if(this.GPU_load_data_time.length>=10){
                    this.GPU_load_data_time.shift()
                    this.GPU_load_data_value.shift()
                    console.log('更新了')
                    console.log(this.GPU_load_data_time)

                    var j = this.GPU_load_data.length-1
                    let timestamp = this.GPU_load_data[j][0]
                    let date = new Date(parseInt(timestamp)*1000);
                    let Year = date.getFullYear();
                    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
                    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                    let  GMT =  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Sechond;

                    this.GPU_load_data_time.push(GMT)
                    this.GPU_load_data_value.push(this.GPU_load_data[j][1])

                    console.log('test'+GMT)
                }else{
                    for(var i = 0; i < this.GPU_load_data.length; i = i+60){
                    
                    let timestamp = this.GPU_load_data[i][0]
                    let date = new Date(parseInt(timestamp)*1000);
                    let Year = date.getFullYear();
                    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
                    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                    let  GMT =  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Sechond;
                    this.GPU_load_data_time.push(GMT)
                    this.GPU_load_data_value.push(this.GPU_load_data[i][1])
                 }
                }
                
                // console.log(this.GPU_load_data_time)
            })
            
        },
    
        get_gpu_process_info(){
            this.$http.get('http://192.168.13.147:30039/api/v1/query?query=process_info').then(res =>{
                console.log(res)
                for(var i=0; i < res.data.data.result.length; i ++){
                    this.gpu_process_info.push({
                        command:res.data.data.result[i].metric.command,
                        container:res.data.data.result[i].metric.container,
                        cpu_mem:res.data.data.result[i].metric.cpu_mem,
                        job:res.data.data.result[i].metric.job,
                        namespace:res.data.data.result[i].metric.namespace,
                        pid:res.data.data.result[i].metric.pid,
                        pod:res.data.data.result[i].metric.pod
                    })
                }
            })
        },
        
        drawChart_temperature(){
            let newPromise = new Promise((resolve) => {
                resolve()
                })
            newPromise.then(() => {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = this.$echarts.init(document.getElementById("GPU_temperature_chart"));
                let option = {
                title: {
                    text: "GPU温度",
                    left: 'center',
                    top: '0px'
                },
                series: [
                    {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 60,
                    splitNumber: 12,
                    itemStyle: {
                        color: '#FFAB91'
                    },
                    progress: {
                        show: true,
                        width: 30
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                        width: 30
                        }
                    },
                    axisTick: {
                        distance: -45,
                        splitNumber: 5,
                        lineStyle: {
                        width: 2,
                        color: '#999'
                        }
                    },
                    splitLine: {
                        distance: -52,
                        length: 14,
                        lineStyle: {
                        width: 3,
                        color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: 5,
                        color: '#999',
                        fontSize: 10
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 20,
                        fontWeight: 'bolder',
                        formatter: '{value} °C',
                        color: 'inherit'
                    },
                    data: [
                        {
                        value: this.gpu_temperature
                        }
                    ]
                    },
                ]
                };
                option && myChart.setOption(option);
            })
        },
        drawChart_load(){
            // 基于准备好的dom，初始化echarts实例
            let newPromise = new Promise((resolve) => {
                resolve()
            })
            //然后异步执行echarts的初始化函数
            newPromise.then(() => {
            //	此dom为echarts图标展示dom
            let myChart = this.$echarts.init(document.getElementById('GPU_load_history'))
            let option = {
                title: { text: 'GPU负载百分比' },
                xAxis: {
                    data: Object.values(this.GPU_load_data_time)
                },
                yAxis: {},
                series: [
                    {
                        data: Object.values(this.GPU_load_data_value),
                        type: 'line',
                        areaStyle: {
                            opacity: 0.5
                        },
                        emphasis: {
                            label:{
                                show: true
                            }
                        }
                    }]
            }
            // 绘制图表
            option && myChart.setOption(option);
        });
    },
        
    },
    created(){
        this.GPU_load_data = []
        this.GPU_load_data_time = []
        this.GPU_load_data_value = []
        this.get_gpu_load();
        this.get_gpu_temperature();
        this.get_gpu_process_info();
        this.get_gpu_frequency_current();
        this.get_gpu_power_control_status();
        this.get_gpu_railgate_status();
        this.get_gpu_tpc_pg_mask_status();
        this.get_gpu_3d_scaling_status();
    },
    mounted() {
        setTimeout(() =>{
            // this.drawChart_nodes();
            // this.drawChart_load();
            this.drawChart_load();
            this.drawChart_temperature();
        },1000);
        this.timer_load = setInterval(this.get_gpu_load, 5000);
        this.timer_load = setInterval(this.get_gpu_temperature, 5000);
        
    },
    watch:{
      GPU_load_data_time:{
        handler(newVal){
          console.log(newVal);
          //如果监听到了status的变化，那么就重新更新拓扑图，更新状态
          // console.log(this.edgeStatus[2])
          this.drawChart_load()
        },
      },
      gpu_temperature:{
        handler(newVal){
          console.log(newVal);
          //如果监听到了status的变化，那么就重新更新拓扑图，更新状态
          // console.log(this.edgeStatus[2])
          this.drawChart_temperature()
        },
      }
    },
}
</script>

<style scoped>
.interface{
  height: 100%;
  background-color: #F2F6FC;
  position: fixed;
  overflow: auto;
  width: 100%;
}
.NodeInfoCard1{
  /* position: relative; */
  width: 84%;
  padding: 10px;
  top:30px;
  left:2%;
  right: 2%;
}

.NodeInfoCard2{
    position: relative;
    width: 84%;
    margin-bottom: 5%;
    padding: 10px;
    margin-top:60px;
    left:2%;
    right: 2%;
}


</style>