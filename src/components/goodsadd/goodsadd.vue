<template>
  <el-card>
    <!-- 添加一个面包屑 -->
    <crumbs :navone="'商品管理'" :navtow="'商品列表'"></crumbs>
    <!-- 添加一个消息提示条 -->
    <el-alert class="myalter" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 添加进度条 -->
    <el-steps :active="active" finish-status="success" align-center class="mysteps">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 切换 -->
    <el-tabs :tab-position="tabPosition" @tab-click="tabclick">
      <!-- 商品内容添加区域 -->
       <el-tab-pane label="基本信息" name="first">
        <!-- 基本信息 -->
        <el-form :label-position="'top'" :rules="rules" label-width="80px" :model="addObj">
          
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addObj.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数据" prop="goods_number">
            <el-input v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="cateSelect" :options="catesList" :props="cateObj"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div class="mydiv" v-for="(item, index1) in manyparams" :key="index1">
          <h4>{{ item.attr_name }}</h4>
          <div class>
            <el-checkbox
              v-model="check"
              border
              v-for="(val, index2) in item.attr_vals.split(',')"
              :key="index2"
            >{{ val }}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <div class="mydiv" v-for="(item,index) in onlyparams" :key="index">
          <h4>{{item.attr_name}}</h4>
          <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- 添加一个图片上传 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload" 
          :file-list="fileList"
          :on-success="uploadsuccess" :on-remove="remove"
          :on-preview="preview"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="diwu">
        <el-button @click="addgoods">添加商品</el-button>
        <quill-editor v-model="content"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 点击图片预览时的对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogImg">
      <img ref="myimg">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImg = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入面包屑
import crumbs from "../layout/breadnav/breadnav.vue";
export default {
  data() {
    return {
      active: 0,
      catesList: [], // 所有的的分类数据
      cateSelect: [], // 级联选择数据
      manyparams: [], // 动态参数（商品参数）
      onlyparams: [], // 静态参数
      fileList:[], // 上传图片的集合
       content: '',
      dialogImg:false,
      uploadHead: {
        Authorization: localStorage.getItem('token')
      }, // 上传的请求头
      check: true,
      tabPosition: "left",
      addObj: {
        // 添加对象的属性
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      rules: {  // 验证规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      cateObj: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  methods: {
    // 获取分类数据
    async getList() {
      // 发送请求
      let res = await this.$http.get(`categories?type=3`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        this.catesList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 给tab选项卡添加事件
    tabclick(tab, event) {
      this.active = +tab.index;
      if (tab.index === "1" || tab.index === "2") {
        // 判断是否选择了数据, 得到数组的长度
        if (this.cateSelect.length === 0) {
          this.$message.error("请选择商品分类");
          return;
        }
        this.getCateParams(tab.index);
      }
    },
    // 封装一个方法来获取分类的参数
    async getCateParams(index) {
      // 得到分类ID
      let id = this.cateSelect[this.cateSelect.length - 1];
      // 设置一个参数用来判断是商品参数还是商品参数
      let sel = index === "1" ? "many" : "only";
      // 根据选中的参数分类加载商品参数
      let res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        if (index === "1") {
          // 赋值
          this.manyparams = data;
        } else {
          this.onlyparams = data;
        }
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 图片上传的执行的函数
   uploadsuccess(res, file, fileList) {
      // 将上传成功的图片保存到 fileList 中
      // res: 服务器响应回来的数据
      //  tmp_path: 生成的图片的名称
      //  url: 上传后图片所在的服务器的路径
      // file: 本次上传文件信息（包含了 res）
      // fileList: 上传的所有文件信息（包信了 file）
      this.fileList.push({
        name: res.data.tmp_path,
        url: res.data.url
      })
    },
    // 删除图片
    remove(file,fileList){
      // 通过 file 中的属性去删除 fileList 中的数据
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name === file.name) {
          this.fileList.splice(i,1)
        }
        
      }
    },
    // 图片的预览
    preview(file){
      this.dialogImg = true
      this.$nextTick(function() {
        this.$refs.myimg.src = file.url
      })
    },
    // 提交数据
   async addgoods(){
      let addObj = {
        goods_name:this.addObj.goods_name, // 商品名称
        goods_cat:this.cateSelect.join(","), // 商品分类
        goods_price:this.addObj.goods_price, // 商品价格
        goods_number:this.addObj.goods_number, // 商品价格
        goods_weight:this.addObj.goods_weight , // 商品重量
        goods_introduce:this.content
      }
      let res = await this.$http.post("goods",addObj)
      // 解构
      let {meta} = res.data
      if(meta.status === 201){
        this.$message({
          type:"success",
          message:meta.msg
        })
        this.$router.push({name:"goods"})
      }else{
        this.$message.error(meta.msg)
      }
    }
  },
  components: {
    crumbs
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
.mysteps,
.myalter {
  margin-top: 20px;
}
.mydiv h4 {
  font-weight: 400px;
  font-size: 13px;
}

.ql-editor {
  height: 300px;
}
</style>
