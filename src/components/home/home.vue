<template>
  <div class="mycon">
    <el-container>
      <!-- 头部区域 -->
      <!-- 头部区域使用Layout 布局分为24 -->
      <el-header>
        <tophead></tophead>
      </el-header>
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside width="200px">
          <Aside/>
        </el-aside>
        <!-- 主体内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入tophead组件
import tophead from "../layout/tophead/tophead.vue";
// 引入aside
import Aside from "../layout/aside/aside.vue";
export default {
  // 判断是否存在token
  mounted() {
    var token = window.localStorage.getItem("token");
    // 判断
    if (!token) {
      // 进到这里说明没有登录,需要重新跳转回login
      this.$router.push("/login");
    }
  },
  components: {
    tophead,
    Aside
  }
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}
.el-container {
  height: 100%;
}
.mycon {
  height: 100%;
}
.altitude {
  height: 60px;
}

.mymenu {
  height: 100%;
}
</style>
