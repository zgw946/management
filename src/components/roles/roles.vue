<template>
  <el-card>
    <!-- 添加一个面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加一个新增角色的按钮 -->
    <el-row>
      <el-button type="info" plain>添加角色</el-button>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :border="true" :data="rolesList" style="width: 100%">
      <!-- 添加展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 最外层 -->
          <el-row v-for="(item1, index1) in scope.row.children" :key="index1">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag
                @close="myclose(scope.row.id, item1.id, scope)"
                :disable-transitions="false"
                closable
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row v-for="(item2, index2) in item1.children" :key="index2">
                <!-- 二级权限 -->
                <el-col :span="5">
                  <el-tag
                    @close="myclose(scope.row.id, item2.id, scope)"
                    :disable-transitions="false"
                    closable
                    type="success"
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="19">
                  <el-tag
                    @close="myclose(scope.row.id, item3.id, scope)"
                    :disable-transitions="false"
                    class="mytag3"
                    type="warning"
                    closable
                    v-for="(item3, index3) in item2.children"
                    :key="index3"
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- slot-scope = "scope" 就是获取当前的行的数据-->
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button
            type="success"
            @click="authority(scope)"
            icon="el-icon-check"
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置权限的对话框 -->
    <!--  props: 用来指定数据源中显示的文本属性&子选项的属性
                                    show-checkbox: 显示多选框
                                    data: 绑定数据源
                                    default-expand-all: 展开所有项
                                    default-checked-keys：设置默认选中
    node-key：设置当前节点的唯一标识-->
    <el-dialog title="权限分配" :visible.sync="dialogList">
      <!-- 树形 -->
      <el-tree
        :data="rightsList"
        :props="props"
        node-key="id"
        ref="tree"
        :default-checked-keys="defaultcheck"
        default-expand-all
        show-checkbox
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <!-- 按钮 -->
        <el-button @click="dialogList = false">取 消</el-button>
        <el-button type="primary" @click="dialogto">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [], // 角色数据源
      dialogList: false, // 分配角色对话框
      defaultcheck: [], // 默认选中的数组
      rightsList: [], // 所有的权限数据
      props: {
        label: "authName",
        children: "children"
      },
      rid: ""
    };
  },
  methods: {
    // 获取数据
    async getdata() {
      let res = await this.$http.get("roles");
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        this.rolesList = data;
      } else {
        this.$message.error(meta.msg);
      }
      // console.log(res.data);
    },
    // 删除角色权限
    //  roleId 要删除权限的角色 id
    //  rightId 要删除的权限 id
    //  scope 当前行的数据源
    async myclose(roleId, rightId, scope) {
      let res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        // 更新权限
        scope.row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 打开分配角色对话框,并且获权限数据
    async authority(scope) {
      // 打开对话框将角色id保存起来
      this.rid = scope.row.id;
      // 每次打开分配对话框都要将默认选中的清空
      this.defaultcheck = [];
      // 打开对话框
      this.dialogList = true;

      // 以树形结构获取权限数据
      let res = await this.$http.get(`rights/tree`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        this.rightsList = data;
        // 生成权限
        // 一级权限
        scope.row.children.forEach(item1 => {
          // 二级权限
          item1.children.forEach(item2 => {
            // 三级权限
            item2.children.forEach(item3 => {
              // 得到第三级权限的ID
              this.defaultcheck.push(item3.id);
            });
          });
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 给角色分配对应的权限
    async dialogto(){
      // 获取当前树形结构中已经被选中的一二三级权限
      // getCheckdkeys: 得到全选节点的key
      let allchek = this.$refs.tree.getCheckedKeys()
      let half = this.$refs.tree.getHalfCheckedKeys()
      // 进行合并
      let arr = [...allchek,...half]
      // 转为字符串
      let rids = arr.join(",")
      // 发送请求到服务器
      let res =  await this.$http.post(`roles/${this.rid}/rights`,{
        rids:rids
      })
      // 解构
      let {meta} = res.data
      if(meta.status === 200){
        this.$message({
          type:"success",
          message:meta.msg
        })
        // 重新获取数据
        this.getdata()
      }else{
        this.$message.error(meta.msg)
      }
      // 关闭角色授权面板
      this.dialogList = false
    }
  },
  mounted() {
    this.getdata();
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
.mytag3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
