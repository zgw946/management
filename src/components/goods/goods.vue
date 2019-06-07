<template>
  <el-card>
    <!-- 添加面包屑导航 -->
    <mygoods :navone="'商品管理'" :navtow="'商品列表'"></mygoods>
    <!-- 添加输入框 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" @click="mysearch" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="18">
        &nbsp;
        <el-button type="info" plain @click="goodsadd">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :data="tableData" style="width: 100%" :border = "true">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_number" label="商品重量"></el-table-column>
      <el-table-column label="创立时间">
          <template slot-scope="scope">
              {{scope.row.add_time | myfilter("YYYY-MM-DD hh:mm:ss")}}
          </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 添加分页功能 -->
    <el-pagination 
         @current-change="handleCurrentChange"
           @size-change="handleSizeChange"
        :current-page="currentPage" 
        :page-sizes="pageSizes" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
// 引入面包屑
import mygoods from "../layout/breadnav/breadnav.vue";
export default {
    data() {
        return {
            tableData:[] , // 所有的列表数据
            currentPage:1, // 当前页
            pageSize:10, // 页容量
            pageSizes:[10,20,30,40,50,60,70,80] ,// 页容量选项
            total:0, // 总条数
            search:"" // 搜索数据

        }
    },
  methods: {
    // 得到所有的数据列表
    async getData(){
        let res = await this.$http.get(`/goods?pagenum=${this.currentPage}&pagesize=${this.pageSize}&query=${this.search}`)
        // 解构
        let {meta,data} = res.data
        // 判断 
        if(meta.status === 200){
            // 获取数据的总条数
            this.total = data.total
            // 获取数据源
            this.tableData = data.goods
        }else{
            this.$message.error(meta.msg)
        }
        
    },
    mysearch(){
        this.getData()
    },
    handleCurrentChange(val){
        this.currentPage = val
        // 重新获取数据
         this.getData()
    },
    handleSizeChange(val){
        this.pageSize = val
        // 重新获取数据
         this.getData()
    },
    goodsadd(){
        // 添加商品
        this.$router.push("/goods/add")
    }
  },
  mounted() {
      this.getData()
  },
  components: {
    mygoods
  }
};
</script>

<style>
</style>
