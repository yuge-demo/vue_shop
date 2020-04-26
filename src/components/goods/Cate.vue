<template>
      <div class="cate">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-row>
                        <el-col>
                              <el-button type="primary">添加分类</el-button>
                        </el-col>
                  </el-row>
                  <el-table :data="tableData" border style="width: 100%">
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="分类名称" width="180"></el-table-column>
                        <el-table-column label="是否有效" width="180"></el-table-column>
                        <el-table-column label="排序"></el-table-column>
                        <el-table-column label="操作"></el-table-column>
                  </el-table>
            </el-card>
      </div>
</template>

<script>
export default {
      name: "cate",
      data() {
            return {
                  //查询条件
                  querInfo: {
                        type: 3,
                        pagenum: 1,
                        pagesize: 5
                  },
                  //商品分类的数据列表， 默认为空
                  cateList: [],
                  //总数据条数
                  total: 0
            };
      },
      created() {
            this.getCartList();
      },
      methods: {
            //获取商品分类的数据
            async getCartList() {
                  const { data: res } = await this.axios.get("categories", {
                        params: this.querInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取参评列表失败");
                  }
                  //把数据分享给数据列表
                  this.cateList = res.data.result;
                  //总数据条数赋值
                  this.total = res.data.total;
            }
      }
};
</script>
<style>
</style>
