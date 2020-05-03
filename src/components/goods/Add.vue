<template>
      <div class="add">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
                  <el-steps
                        :space="200"
                        :active="activeIndex - 0"
                        finish-status="success"
                        align-center
                  >
                        <el-step title="基本信息"></el-step>
                        <el-step title="商品参数"></el-step>
                        <el-step title="商品属性"></el-step>
                        <el-step title="商品图片"></el-step>
                        <el-step title="商品内容"></el-step>
                        <el-step title="完成"></el-step>
                  </el-steps>
                  <el-form
                        :model="addFrom"
                        :rules="addFromRules"
                        ref="addFromRef"
                        label-position="top"
                        label-width="100px"
                  >
                        <el-tabs
                              v-model="activeIndex"
                              :tab-position="'left'"
                              :before-leave="beforeTabLeave"
                        >
                              <!-- name的值是字符串 -->
                              <el-tab-pane label="基本信息" name="0">
                                    <el-form-item label="商品名称" prop="goods_name">
                                          <el-input v-model="addFrom.goods_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品价格" prop="goods_price">
                                          <el-input v-model="addFrom.goods_price" type="number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品重量" prop="goods_weight">
                                          <el-input v-model="addFrom.goods_weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品数量" prop="goods_number">
                                          <el-input v-model="addFrom.goods_name" type="number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="goods_cat">
                                          <el-cascader
                                                v-model="addFrom.goods_cat"
                                                :options="cateList"
                                                :props="{ expandTrigger: 'hover'  ,value:'cat_id',label:'cat_name',children:'children'}"
                                                @change="handleChange"
                                          ></el-cascader>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                              <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                              <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                              <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                        </el-tabs>
                  </el-form>
            </el-card>
      </div>
</template>

<script>
export default {
      name: "add",
      data() {
            return {
                  activeIndex: "0",
                  //表单验证规则对象
                  addFrom: {
                        good_name: "",
                        goods_price: 0,
                        goods_weight: "",
                        goods_number: 0,
                        // 商品所属分类数组
                        goods_cat: []
                  },
                  //表单验证规则对象
                  addFromRules: {
                        good_name: [
                              {
                                    required: true,
                                    message: "请输入商品名称",
                                    trigger: "blur"
                              }
                        ],
                        goods_price: [
                              {
                                    required: true,
                                    message: "请输入商品价格",
                                    trigger: "blur"
                              }
                        ],
                        goods_weight: [
                              {
                                    required: true,
                                    message: "请输入商品重量",
                                    trigger: "blur"
                              }
                        ],
                        goods_number: [
                              {
                                    required: true,
                                    message: "请输入商品数量",
                                    trigger: "blur"
                              }
                        ],
                        goods_cat: [
                              {
                                    required: true,
                                    message: "请选择商品分类",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //保存商品列表数据
                  cateList: [],
                  //级联选择框的数据
                  cascader: {}
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            async getCateList() {
                  const { data: res } = await this.axios.get("categories");
                  if (res.meta.status !== 200) {
                        return this.$message.erroe("获取商品列表失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.cateList = res.data;
            },
            // 级联选择器发生变化的时候会触发这个函数
            handleChange() {
                  console.log(this.addFrom.goods_cat);
                  if (this.addFrom.goods_cat.length !== 3) {
                        this.addFrom.goods_cat = [];
                  }
            },
            // after 即将进入 befove 即将离开
            beforeTabLeave(after, before) {
                  if (before === "0" && this.addFrom.goods_cat.length !== 3) {
                        this.$message.error("商品分类失败");
                        return false;
                  }
            }
      }
};
</script>
<style>
.el-steps {
      margin-top: 15px;
      font-size: 13px;
}
</style>
