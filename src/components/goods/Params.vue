<template>
      <div class="params">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
                  <el-row style="margin:15px 0">
                        <el-col>
                              <span>选择商品列表:</span>
                              <!-- 选择商品分类的级联选择框 -->
                              <el-cascader
                                    v-model="selectedCateKeys"
                                    :options="cateList"
                                    :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children'}"
                                    @change="handleChange"
                              ></el-cascader>
                        </el-col>
                  </el-row>
                  <el-tabs v-model="activeName" @tab-click="handleTabClick">
                        <!-- 添加动态参数面板 -->
                        <el-tab-pane label="动态参数" name="many">
                              <el-button
                                    type="primary"
                                    :disabled="isBtnDisables"
                                    @click="
                              addDialogVisible = true"
                              >动态参数</el-button>
                              <el-table :data="manyTableData" border stripe>
                                    <el-table-column type="expand"></el-table-column>
                                    <el-table-column type="index" label="#"></el-table-column>
                                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                                    <el-table-column label="操作">
                                          <template slot-scope="scope">
                                                <el-button
                                                      type="primary"
                                                      icon="el-icon-edit"
                                                      size="mini"
                                                      @click="showEditDailog(scope.row.attr_id)"
                                                >编辑</el-button>
                                                <el-button
                                                      type="danger"
                                                      icon="el-icon-search"
                                                      size="mini"
                                                >删除</el-button>
                                          </template>
                                    </el-table-column>
                              </el-table>
                        </el-tab-pane>
                        <!-- 添加静态属性面板 -->
                        <el-tab-pane label="静态属性" name="only">
                              <el-button
                                    type="primary"
                                    :disabled="isBtnDisables"
                                    @click="addDialogVisible = true"
                              >静态属性</el-button>
                              <el-table :data="onlyTableData" border stripe>
                                    <el-table-column type="expand"></el-table-column>
                                    <el-table-column type="index" label="#"></el-table-column>
                                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                                    <el-table-column label="操作">
                                          <template slot-scope="scope">
                                                <el-button
                                                      type="primary"
                                                      icon="el-icon-edit"
                                                      size="mini"
                                                      @click="showEditDailog(scope.row.attr_id)"
                                                >编辑</el-button>
                                                <el-button
                                                      type="danger"
                                                      icon="el-icon-search"
                                                      size="mini"
                                                >删除</el-button>
                                          </template>
                                    </el-table-column>
                              </el-table>
                        </el-tab-pane>
                  </el-tabs>
            </el-card>
            <!-- 添加表单参数 -->
            <el-dialog
                  :title="'修改'+titleText"
                  :visible.sync="addDialogVisible"
                  width="50%"
                  @close="addDialogClosed"
            >
                  <el-form
                        ref="addFormRef"
                        :model="addform"
                        :rules="addFormRules"
                        label-width="100px"
                  >
                        <el-form-item :label="titleText" prop="attr_name">
                              <el-input v-model="addform.attr_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addParams">确 定</el-button>
                  </span>
            </el-dialog>
            <!-- 修改表单参数 -->
            <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%">
                  <el-form
                        ref="editFormRef"
                        :model="editform"
                        :rules="editFormRules"
                        label-width="100px"
                        @close="editDialogClosed"
                  >
                        <el-form-item :label="titleText" prop="attr_name">
                              <el-input v-model="editform.attr_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editParams">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "parasm",
      data() {
            return {
                  cateList: [],
                  //级联选择框双向绑定数组
                  selectedCateKeys: [],
                  //被激活的名称
                  activeName: "many",
                  //动态参数数据
                  manyTableData: [],
                  //静态属性数据
                  onlyTableData: [],
                  //控制添加对话框的显示与隐藏
                  addDialogVisible: false,
                  //添加参数的表单数据对象
                  addform: {
                        attr_name: ""
                  },
                  //添加参数的表单验证规则
                  addFormRules: {
                        attr_name: {
                              required: true,
                              message: "请输入参数名称",
                              trigger: "blur"
                        }
                  },
                  //修改表单对话框的显示与隐藏
                  editDialogVisible: false,
                  //修改表单参数的数据对象
                  editform: {
                        attr_name: ""
                  },
                  //修改表单参数的验证规则
                  editFormRules: {
                        attr_name: {
                              required: true,
                              message: "请输入参数名称",
                              trigger: "blur"
                        }
                  }
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            //获取所有的商品分类
            async getCateList() {
                  const { data: res } = await this.axios.get("categories");
                  if (res.meta.status !== 200) {
                        return this.message.error("获取商品分类失败");
                  }
                  this.cateList = res.data;
            },
            //级联选中变化，会触发这个函数
            handleChange() {
                  this.getParamsData();
            },
            //点击Tab页签时候触发这个函数
            handleTabClick() {
                  this.getParamsData();
            },
            //获取参数的列表数据
            async getParamsData() {
                  //只允许为第三级分类设置相关参数
                  if (this.selectedCateKeys.length !== 3) {
                        this.selectedCateKeys = [];
                        return;
                  }
                  // console.log(this.selectedCateKeys); // 根据所选分类的Id 和当前所处的面板获取对应的参数
                  const { data: res } = await this.axios.get(
                        `categories/${this.cateId}/attributes`,
                        {
                              params: { sel: this.activeName }
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("参数获取失败");
                  }
                  if (this.activeName === "many") {
                        this.manyTableData = res.data;
                  } else {
                        this.onlyTableData = res.data;
                  }
            },
            //填表表单对话框关闭时候需要删除 关闭事件
            addDialogClosed() {
                  this.$refs.addFormRef.resetFields();
            },
            //点击按钮添加
            addParams() {
                  this.$refs.addFormRef.validate(async valid => {
                        if (!valid) return;
                        const { data: res } = await this.axios.post(
                              `categories/${this.cateId}/attributes`,
                              {
                                    attr_name: this.addform.attr_name,
                                    attr_sel: this.activeName
                              }
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("提交参数失败");
                        }
                        this.$message.success("提交参数成功");
                        this.getParamsData();
                        this.addDialogVisible = false;
                  });
            },
            //修改对话框的关闭是事件
            editDialogClosed() {
                  this.$refs.editFormRef.resetFields();
            },
            //点击按钮添加对话框
            async showEditDailog(id) {
                  const { data: res } = await this.axios.get(
                        `categories/${this.cateId}/attributes/${id}`,
                        {
                              params: {
                                    attr_sel: this.activeName
                              }
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.editform = res.data;
                  this.editDialogVisible = true;
            },
            //修改表单提交
            editParams() {
                  this.$refs.editFormRef.validate(async valid => {
                        if (!valid) return;
                        const { data: res } = await this.axios.put(
                              `categories/${this.cateId}/attributes/${this.editform.attr_id}`,
                              {
                                    attr_name: this.editform.attr_name,
                                    attr_sel: this.activeName
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("修改失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getParamsData();
                        this.editDialogVisible = false;
                  });
            }
      },
      // 计算属性
      computed: {
            //如果按钮需要被就用则返回true 否则返回false
            isBtnDisables() {
                  if (this.selectedCateKeys.length !== 3) {
                        return true;
                  }
                  return false;
            },
            //当前选中的三级分类的ID
            cateId() {
                  if (this.selectedCateKeys.length === 3) {
                        //this.selectedCateKsys[2];  [2]的意思是索引值2
                        return this.selectedCateKeys[2];
                  }
                  return null;
            },
            //动态计算标题的文本
            titleText() {
                  if (this.activeName === "many") {
                        return "动态参数";
                  } else {
                        return "静态属性";
                  }
            }
      }
};
</script>
<style>
.el-cascader {
      margin-left: 15px;
      width: 300px;
}
.el-tabs {
      margin-top: 15px;
}
</style>
