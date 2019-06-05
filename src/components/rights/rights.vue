<template>
  <el-card>
    <!-- 添加一个面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :border="true" :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          {{scope.row.level === "0" ? "一级":(scope.row.level === "1" ? "二级" : "三级")}}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData:[]
    }
  },
  methods: {
    async getList() {
      // 发送请求获取数据
      let res = await this.$http.get(`rights/list `);
      let {meta , data} = res.data
      if(meta.status === 200){
        this.tableData = data
      }else{
       this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    this.getList();
  }
};
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
