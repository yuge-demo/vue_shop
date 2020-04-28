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
                              <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                        </el-col>
                  </el-row>
                  <tree-table
                        :data="cateList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        border
                        show-index
                        index-text="#"
                  >
                        <!-- 是否有效 -->
                        <template slot="isok" slot-scope="scope">
                              <i
                                    class="el-icon-success"
                                    v-if="scope.row.cat_deleted === false"
                                    style="color: lightgreen"
                              ></i>
                              <i class="el-icon-eror" v-else style="color: red"></i>
                        </template>
                        <!-- 排序 -->
                        <template slot="order" slot-scope="scope">
                              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                              <el-tag
                                    size="mini"
                                    type="success"
                                    v-else-if="scope.row.cat_level === 1"
                              >二级</el-tag>
                              <el-tag size="mini" type="warning" v-else>三级</el-tag>
                        </template>
                        <!-- 操作 -->
                        <template slot="opt" slot-scope="scope">
                              <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.cat_id)"
                              >编辑</el-button>
                              <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="removeRoleById(scope.row.cat_id)"
                              >删除</el-button>
                        </template>
                  </tree-table>
                  <!-- 分页区域 -->
                  <!-- size-change页面数量 -->
                  <!-- current-change页码发生变化 -->
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="querInfo.pagenum"
                        :page-sizes="[2,3,4,5,15]"
                        :page-size="querInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                  ></el-pagination>
            </el-card>

            <el-dialog
                  title="添加分类"
                  :visible.sync="addCatedialogVisible"
                  width="50%"
                  @close="addCateDialogClose"
            >
                  <el-form
                        :model="addCateForm"
                        ref="addCateFormRef"
                        label-width="100px"
                        :rules="addCateFormRules"
                  >
                        <el-form-item label="分类名称 :" prop="cat_name">
                              <el-input v-model="addCateForm.cat_name"></el-input>
                        </el-form-item>
                        <el-form-item label="父级名称 :">
                              <!-- option指定数据源 -->
                              <!-- props用来指定配置对象 -->
                              <el-cascader
                                    v-model="selectedKeys"
                                    :options="parentCateList"
                                    :props="{ expandTrigger: 'hover', value:'cat_id',label:'cat_name' ,children:'children' }"
                                    @change="parentCateChanged"
                                    clearable
                              ></el-cascader>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addCatedialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addCate">确 定</el-button>
                  </span>
            </el-dialog>
            <!-- 修改 -->
            <el-dialog title="修改分类" :visible.sync="editdialogVisible" width="50%">
                  <el-form ref="editFromRef" :model="editFrom" label-width="70px">
                        <el-form-item label="分类名称">
                              <el-input v-model="editFrom.cat_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editUser">确 定</el-button>
                  </span>
            </el-dialog>
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
                  total: 0,
                  //为tabel指定列的定义
                  columns: [
                        {
                              label: "分类名称",
                              //属性名称
                              prop: "cat_name"
                        },
                        {
                              label: "是否有效",
                              //表示 将当前列定义为模板列
                              type: "template",
                              //表示当前这一列使用模板名称
                              template: "isok"
                        },
                        {
                              label: "排序",
                              //表示 将当前列定义为模板列
                              type: "template",
                              //表示当前这一列使用模板名称
                              template: "order"
                        },
                        {
                              label: "操作",
                              //表示 将当前列定义为模板列
                              type: "template",
                              //表示当前这一列使用模板名称
                              template: "opt"
                        }
                  ],
                  //控制添加对话框的显示与隐藏
                  addCatedialogVisible: false,
                  //添加分类的表单数据对象
                  addCateForm: {
                        //将要添加的分类名称
                        cat_name: "",
                        //父级添加分类的名称
                        cat_pid: 0,
                        //分类的层级  默认为一级
                        cat_lever: 0
                  },
                  //添加分类的表单验证规则对象
                  addCateFormRules: {
                        cat_name: [
                              {
                                    required: true,
                                    message: "请输入分类名称",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //父级分类的列表
                  parentCateList: [],
                  //指定级联选择起的配置对象
                  // cascaderProps: {
                  //       value: "cat_id",
                  //       label: "cat_name",
                  //       children: "children"
                  // },
                  //选中的父级id数组
                  selectedKeys: [],
                  // 修改分类名称
                  editFrom: {},
                  // 修改用户 的显示与隐藏
                  editdialogVisible: false
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
                        return this.$message.error("获取产品列表失败");
                  }
                  //把数据分享给数据列表
                  this.cateList = res.data.result;
                  //总数据条数赋值
                  this.total = res.data.total;
            },
            //监听pagesize 可以拿到最新的pagesize
            handleSizeChange(newSize) {
                  this.querInfo.pagesize = newSize;
                  this.getCartList();
            },
            //监听pagenum的改变
            handleCurrentChange(newPage) {
                  this.querInfo.pagenum = newPage;
                  this.getCartList();
            },
            //点击按钮展示添加对话框
            showAddCateDialog() {
                  this.getParentCateList();
                  this.addCatedialogVisible = true;
            },
            //获取父级的分类列表
            async getParentCateList() {
                  const { data: res } = await this.axios.get("categories", {
                        params: {
                              type: 2
                        }
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取列表失败");
                  }
                  this.parentCateList = res.data;
                  // console.log(this.parentCateList);
            },
            //选择项发生变化触发这个函数
            parentCateChanged() {
                  //如果selectedKeys数组中的length > 0证明选中的父级分类
                  // 反之就说明没有选中父级分类
                  if (this.selectedKeys.length > 0) {
                        //父级分类的id
                        this.addCateForm.cat_pid = this.selectedKeys[
                              this.selectedKeys.length - 1
                        ];
                        this.addCateForm.cat_lever = this.selectedKeys.length;
                        return;
                  } else {
                        this.addCateForm.cat_pid = 0;
                        this.addCateForm.cat_lever = 0;
                  }
            },
            //点击按钮添加分类
            addCate() {
                  this.$refs.addCateFormRef.validate(async vaild => {
                        if (!vaild) return;
                        const { data: res } = await this.axios.post(
                              "categories",
                              this.addCateForm
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("添加分类失败");
                        }
                        this.$message.success("添加分类成功");
                        this.getCartList();
                        this.showAddCateDialog = false;
                  });
            },
            //关闭添加对话框并且删除内容
            addCateDialogClose() {
                  this.$refs.addCateFormRef.resetFields();
                  this.selectedKeys = [];
                  this.addCateForm.cat_lever = 0;
                  this.addCateForm.cat_pid = 0;
            },
            //修改用户对话框
            async showEditDialog(id) {
                  const { data: res } = await this.axios.get(
                        "categories/" + id
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("查询用户失败");
                  }
                  this.editFrom = res.data;
                  this.editdialogVisible = true;
            },
            //编辑对话框提交
            async editUser() {
                  const { data: res } = await this.axios.put(
                        `categories/${this.editFrom.cat_id}`,
                        {
                              cat_name: this.editFrom.cat_name
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("用户更新失败");
                  }
                  this.$message.success("更新用户成功");
                  this.getCartList();
                  this.editDialogVisible = false;
            },
            // 删除用户
            async removeRoleById(id) {
                  const resultConfirm = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (resultConfirm !== "confirm") {
                        return this.$message.success("删除取消");
                  }
                  const { data: res } = await this.axios.delete(
                        "categories/" + id
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  this.$message.success("删除成功");
                  this.getCartList();
            }
      }
};
</script>
<style>
.zk-table {
      margin-top: 15px;
}
.el-cascader {
      width: 100%;
}
</style>
