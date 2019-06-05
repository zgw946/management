<template>
  <el-card>
    <!-- 添加一个面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加输入框 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchdata"></el-button>
        </el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="18">
        &nbsp;
        <el-button type="info" plain @click="add">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :border="true" :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            @change="switching(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- slot-scope = "scope" 就是获取当前的行的数据-->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="getedit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="getDlelete(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="role(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加一个弹出框 -->
    <el-dialog title="添加用户" :visible.sync="ShowHide">
      <el-form :rules="rules" ref="addForm" :model="formObj">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="formObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
          <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ShowHide = false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据的对话框 -->
    <el-dialog title="修改用户" :visible.sync="modification ">
      <el-form :rules="rules" ref="addForm" :model="formObj">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="formObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
          <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modification = false">取 消</el-button>
        <el-button type="primary" @click="postedit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="assignment ">
      <el-form ref="addForm" :model="formObj">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">{{formObj.username}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          {{formObj.rid}}
          <el-select v-model="formObj.rid" placeholder="请选择">
            <el-option :value="-1" label="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignment = false">取 消</el-button>
        <el-button type="primary" @click="permission">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      pagenum: 1, // 当前页
      pagesize: 10, // 页容量
      tableData: [], // 当前
      formObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      ShowHide: false,
      modification: false,
      assignment: false, // 角色分配
      formLabelWidth: "100px",
      rules: {
        // 添加验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ], // 用户名验证
        password: [{ required: true, message: "请输入密码", trigger: "blur" }], // 密码验证
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }], // // 邮箱验证
        mobile: [{ required: true, message: "请输入电话号码", trigger: "blur" }] // // 电话号码验证
      },
      options: [] // 得到下拉框中的数据
    };
  },
  methods: {
    // 获取所有的用户数据
    getUserList() {
      // 得到 token
      let token = window.localStorage.getItem("token");
      // 发送请求时需要在请求头中添加 token
      this.$http
        .get("users", {
          headers: {
            // 添加 token
            Authorization: token
          },
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.search
          }
        })
        .then(res => {
          // 接收参数
          let { data, meta } = res.data;
          if (meta.status === 200) {
            // 将数据保存到
            this.tableData = data.users;
          }
        });
    },
    add() {
      this.ShowHide = true;
    },
    // 完成数据的新增
    postAdd() {
      let token = window.localStorage.getItem("token");
      // 1.0 验证数据是否合法
      this.$refs.addForm.validate(vali => {
        if (vali) {
          // 2.0 将数据提交到服务器
          this.$http
            .post(
              "users",
              {
                username: this.formObj.username,
                password: this.formObj.password,
                email: this.formObj.email,
                mobile: this.formObj.mobile
              },
              {
                // token
                headers: {
                  Authorization: token
                }
              }
            )
            .then(res => {
              // 3.0 接收结果，重新渲染
              let { meta } = res.data;
              if (meta.status === 201) {
                this.$message({
                  type: "success",
                  message: meta.msg
                });
                this.getUserList();
                // 关闭面板
                this.ShowHide = false;
                // 清空数据
                this.formObj.username = "";
                this.formObj.password = "";
                this.formObj.email = "";
                this.formObj.mobile = "";
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          this.$message.error("参数不合法");
        }
      });
    },
    // 完成条件的搜索
    searchdata() {
      this.getUserList();
    },
    // 修改数据
    getedit(id) {
      this.modification = true;
      // 发送请求获取对应的id数据
      this.$http
        .get(`users/${id}`, {
          // 给请求头设置Authorization
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          // 解构赋值
          let { meta, data } = res.data;
          // 判断
          if (meta.status === 200) {
            this.formObj = data;
          }
        });
    },
    // 提交修改的数据
    postedit() {
      // 提交数据
      this.$http
        .put(
          `users/${this.formObj.id}`,
          {
            email: this.formObj.email,
            mobile: this.formObj.mobile
          },
          {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          }
        )
        .then(res => {
          let { meta } = res.data;
          if (meta.status === 200) {
            this.modification = false;
            // 提示修改成功
            this.$message({
              type: "success",
              message: meta.msg
            });
            // 更新修改过的数据
            this.getUserList();
          } else {
            this.modification = false;
            this.$message.error(meta.msg);
          }
        });
    },
    // 根据ID去删除对应的数据
    getDlelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送请求获取对应的id
          this.$http
            .delete(`users/${id}`, {
              headers: {
                Authorization: localStorage.getItem("token")
              }
            })
            .then(res => {
              // 解构赋值
              let { meta } = res.data;
              // 判断
              if (meta.status === 200) {
                this.$message({
                  type: "success",
                  message: meta.msg
                });
                this.getUserList();
              } else {
                this.$message.error(meta.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改状态
    switching(id, state) {
      // 根据ID去数据中得到对应的数据
      this.$http
        .put(
          `users/${id}/state/${state}`,
          {},
          {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          }
        )
        .then(res => {
          // 解构
          let { meta } = res.data;
          // 判断
          if (meta.status === 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    // 得到下拉框中的数据
    getoptions() {
      this.$http
        .get("roles", {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          this.options = res.data.data;
        });
    },
    // 分配角色
    role(id) {
      this.assignment = true;
      // 根据 id 获取用户信息
      this.$http
        .get(`users/${id}`, {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          let { meta, data } = res.data;
          if (meta.status == 200) {
            this.formObj = data;
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    // 分配权限
    permission() {
      // 获取参数
      this.$http
        .put(
          `users/${this.formObj.id}/role`,
          {
            rid: this.formObj.rid
          },
          {
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // }
          }
        )
        .then(res => {
          let { meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            // 重新渲染
            this.getUserList();
          } else {
            this.$message.error(meta.msg);
          }
          this.assignment = false;
        });
    }
  },
  mounted() {
    this.getUserList();
    this.getoptions();
  }
};
</script>

<style scoped>
/* .myrow {
  margin-top: 20px;
} */
.el-breadcrumb {
  background-color: #d3dce6;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
}
</style>
