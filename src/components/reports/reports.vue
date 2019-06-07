<template>
  <div>
    <div class id="main" style="width:700px; height:500px;"></div>
  </div>
</template>

<script>
// 引入echarts 
import echarts from 'echarts'
export default {
async mounted() {
    // 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
let res = await this.$http.get(`http://localhost:8888/api/private/v1/reports/type/1`)
// 解构
let {meta,data} = res.data
    var option = {
    title: {
        text: '销售总额'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
};
 option={
     ...option,
     ...data
 },
 option.xAxis[0].type = "category"
 option.xAxis[0].boundaryGap = false

 myChart.setOption(option);
},
}
</script>

<style>
</style>
