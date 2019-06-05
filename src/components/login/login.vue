<template>
  <!-- 

     el-form: 这个组件中的内容都是表单元素
        model: 绑定属性
        status-icon：状态图标
        :rules: 添加验证规则
        ref: 在 vue 中可以通过 this.$refs 来操作 dom 元素
        abel-width：文本的宽度
        label-positio: 设置表单元素的描述文件顶部对齐
        el-form-item: 表单中的表单元素
        label: 当前元素显示的文本
        prop: 设置验证规则
        el-input：input 元素
        ype：类型
        v-model：双向绑定的数据
        autocomplete：自动补全 （h5）
  -->
  <div class="loginbox">
    <el-form
      label-position="top"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="login">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      // 判断form中的元素是否满足验证条件
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 发送登入请求
          this.$http.post("login", this.ruleForm).then(res => {
            // 解构参数
            let { data, meta } = res.data;
            //判断登入状态
            if (meta.status === 200) {
              this.$message({
                message: meta.msg,
                type: "success"
              });
              // 跳转到首页
              this.$router.push("/home")
             // 将 登录 中的 token 保存到浏览器中的 localstorage 中
            localStorage.setItem('token', res.data.data.token)
            } else {
              this.$message.error(meta.msg);
            }
          });
        }
        // valid boolan 值 如果通过返回true 否则false
         else {
          this.$message.error("请输入用户名或密码在执行此操作");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.loginbox {
  padding: 35px;
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
}
.loginbox .btn {
  width: 100%;
}
</style>
