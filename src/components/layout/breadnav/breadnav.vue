<template>
<!-- 封装面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ navone }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ navtow }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
// 使用组件的时穿入两个参数:navone navtow
props:["navone","navtow"]
}
</script>

<style scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
}
</style>
