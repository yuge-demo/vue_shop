<template>
      <div class="list">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-row :gutter="20">
                        <el-col :span="8">
                              <el-input
                                    placeholder="请输入内容"
                                    v-model="queryInfo.query"
                                    clearable
                                    @click="getGoodsList"
                              >
                                    <el-button
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getGoodsList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                        <el-col :span="4">
                              <el-button type="primary" @click="goAddpage">添加用户</el-button>
                        </el-col>
                  </el-row>
                  <el-table :data="goodsList" border stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                        <el-table-column label="创建时间" prop="add_time" width="140px">
                              <!-- 竖线调用过滤器 -->
                              <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="130px">
                              <template slot-scope="scope">
                                    <el-button
                                          type="primary"
                                          icon="el-icon-edit"
                                          size="mini"
                                          @click="showEditDailog(scope.row.goods_id)"
                                    ></el-button>
                                    <el-button
                                          type="danger"
                                          icon="el-icon-delete"
                                          size="mini"
                                          @click="removeById(scope.row.goods_id)"
                                    ></el-button>
                              </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        background
                  ></el-pagination>
            </el-card>
            <!-- 编辑对话框 -->
            <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
                  <el-form
                        ref="editFormRef"
                        :model="editForm"
                        label-width="80px"
                        :rules="editFromRules"
                  >
                        <el-form-item label="商品名称" prop="goods_name">
                              <el-input v-model="editForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                              <el-input v-model="editForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                              <el-input v-model="editForm.goods_number" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量">
                              <el-input v-model="editForm.goods_weight" disabled></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editList">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "list",
      data() {
            return {
                  //查询参数对象
                  queryInfo: {
                        // 搜索关键字
                        query: "",
                        pagenum: 1,
                        pagesize: 10
                  },
                  //商品列表
                  goodsList: [],
                  // 商品总数
                  total: 0,
                  //控制变价对话框的显示
                  editDialogVisible: false,
                  //修改表单参数的数据对象
                  editForm: {
                        goods_name: "",
                        goods_price: "",
                        goods_number: "",
                        goods_weight: ""
                  },
                  // 修改表单验证规则
                  editFromRules: {
                        goods_name: {
                              required: true,
                              message: "请输入商品名称",
                              trigger: "blur"
                        },
                        goods_price: {
                              required: true,
                              message: "请输入商品价格",
                              trigger: "blur"
                        }
                  }
            };
      },
      created() {
            this.getGoodsList();
      },
      methods: {
            //根据分页获取对应的商品列表
            async getGoodsList() {
                  const { data: res } = await this.axios.get("goods", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取商品列表失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.goodsList = res.data.goods;
                  this.total = res.data.total;
            },
            //此函数就是更新页面后触发此函数并且传递此页面数量
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getGoodsList();
            },
            // 此函数就是页面从1-2变化时会触发此函数然后传递新的值
            handleCurrentChange(newPage) {
                  this.queryInfo.pagenum = newPage;
                  this.getGoodsList();
            },
            //删除商品
            async removeById(id) {
                  const resultConfirm = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "iI取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (resultConfirm !== "confirm") {
                        return this.$message.info("已取消删除");
                  }
                  const { data: res } = await this.axios.delete("goods/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getGoodsList();
            },
            //编辑对话框根据id查询相应的物品
            async showEditDailog(id) {
                  const { data: res } = await this.axios.get("goods/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.editForm = res.data;
                  this.editDialogVisible = true;
            },
            //点击确定按钮提交
            editList() {
                  this.$refs.editFormRef.validate(async valid => {
                        if (!valid) return;
                        const { data: res } = await this.axios.put(
                              `goods/${this.editForm.goods_id}`,
                              // this.editForm
                              {
                                    goods_name: this.editForm.goods_name,
                                    goods_price: this.editForm.goods_price,
                                    goods_weight: this.editForm.goods_weight,
                                    goods_number: this.editForm.goods_number
                              }
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("提交商品失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getGoodsList();
                        this.editDialogVisible = false;
                  });
            },
            goAddpage() {
                  this.$router.push("/goods/add");
            }
      }
};
</script>
<style >
</style>
