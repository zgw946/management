<template>
  <div>
    <!-- login图片区域 -->
    <el-row class="altitude">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../../../../static/logo.png" alt="图片丢失">
        </div>
      </el-col>
      <el-col :span="16" class="altitude">
        <!-- 标题 -->
        <div class="grid-content bg-purple-light">
          <h1>电商后台管理系统</h1>
        </div>
      </el-col>
      <el-col :span="4" class="altitude lagout">
        <div class="grid-content bg-purple">
          <a href="#" @click.prevent="out">退出</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    out() {
      this.$confirm("执行此操作你将需要重新登录,确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          // 清除token
          window.localStorage.removeItem("token")
          // 跳转到登录页面
          this.$router.push({name:"login"})
        })
    }
  }
};
</script>

<style scoped>
.lagout {
  text-align: right;
}
.lagout a {
  /* 清除a标签的默认下划线     */
  text-decoration: none;
  /* 设置字体颜色 */
  color: green;
}
.altitude{
  height: 60px;
}
</style>
