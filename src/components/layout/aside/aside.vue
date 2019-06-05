<template>
     <el-menu :router="true" :unique-opened="true" default-active="2" class="mymenu el-menu-vertical-demo" background-color="#fff" text-color="#444">
        <!-- 子选项 -->
        <el-submenu v-for="(item1, index1) in getList" :key="index1" :index="item1.path">
            <!-- 子选项的标题 -->
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item1.authName }}</span>
            </template>
            <!-- 子选项中的子选项：二级选项 -->
            <el-menu-item v-for="(item2, index2) in item1.children" :key="index2" :index="item2.path">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<script>
export default {
 data() {
    return {
      getList:[]
    }
  },
  methods: {
    // 动态生成侧边栏
    async getmenus(){
      // 发送请求获取数据
      let res = await this.$http.get(`menus`)
      // 解构
      let {meta,data} = res.data
      // 判断
      if(meta.status === 200){
        this.getList = data
        console.log( this.getList);
        
      }else{
        this.$message.error(meta.msg)
        
      }
    }
  },

  mounted(){
    this.getmenus()
  }
};
</script>

<style>
</style>
