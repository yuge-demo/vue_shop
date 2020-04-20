<template>
      <div class="app">
            <!-- 面包屑导航区域 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 卡片视图区域 -->
            <el-card class="box-card">
                  <!-- 搜索与添加区域 -->
                  <el-row :gutter="20">
                        <el-col :span="8">
                              <el-input
                                    placeholder="请输入内容"
                                    class="input-with-select"
                                    v-model="queryInfo.query"
                                    clearable
                                    @clear="getUserList"
                              >
                                    <el-button
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getUserList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                        <el-col :span="4">
                              <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                        </el-col>
                  </el-row>
                  <!-- 用户列表区域  -->
                  <el-table :data="userlist" border stripe>
                        <!-- label 指向的是标题    prop指向的是数据 -->
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="姓名" prop="username"></el-table-column>
                        <el-table-column label="邮箱" prop="email"></el-table-column>
                        <el-table-column label="电话" prop="mobile"></el-table-column>
                        <el-table-column label="角色" prop="role_name"></el-table-column>
                        <el-table-column label="状态">
                              <template slot-scope="scope">
                                    <el-switch
                                          v-model="scope.row.mg_state"
                                          @change="userStateChanged(scope.row)"
                                    ></el-switch>
                              </template>
                        </el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scope">
                                    <!-- 修改 删除 分配 -->
                                    <el-button
                                          type="primary"
                                          icon="el-icon-edit"
                                          size="mini"
                                          @click="showEditDialog(scope.row.id)"
                                    ></el-button>
                                    <el-button
                                          type="danger"
                                          icon="el-icon-delete"
                                          size="mini"
                                          @click="removeUserById(scope.row.id)"
                                    ></el-button>
                                    <el-tooltip
                                          effect="dark"
                                          content="分配角色"
                                          placement="top"
                                          :enterable="false"
                                    >
                                          <el-button
                                                type="warning"
                                                icon="el-icon-setting"
                                                size="mini"
                                          ></el-button>
                                    </el-tooltip>
                              </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[1, 2, 3, 4,5]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                  ></el-pagination>
            </el-card>
            <!-- 添加用户对话框 -->
            <el-dialog
                  title="添加用户"
                  :visible.sync="addDialogVisible"
                  width="50%"
                  @close="addDialogClose"
            >
                  <!-- 内容主题区域 -->
                  <el-form
                        :model="addFrom"
                        :rules="addFromRules"
                        ref="addFromRef"
                        label-width="70px"
                  >
                        <el-form-item label="用户名" prop="username">
                              <el-input v-model="addFrom.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                              <el-input v-model="addFrom.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                              <el-input v-model="addFrom.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                              <el-input v-model="addFrom.mobile"></el-input>
                        </el-form-item>
                  </el-form>
                  <!-- 底部区域 -->
                  <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addUser">确 定</el-button>
                        <el-button @click="addDialogVisible = false" type="info">取 消</el-button>
                  </span>
            </el-dialog>
            <!-- 修改用户的对话框 -->
            <el-dialog
                  title="修改用户信息"
                  :visible.sync="editDialogVisible"
                  width="50%"
                  @close="editDialogClose"
            >
                  <el-form
                        ref="editFromRef"
                        :model="editFrom"
                        :rules="editFromRules"
                        label-width="70px"
                  >
                        <el-form-item label="用户名">
                              <el-input v-model="editFrom.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                              <el-input v-model="editFrom.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                              <el-input v-model="editFrom.mobile"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editUser">确 定</el-button>
                        <el-button type="info" @click="editDialogVisible = false">取 消</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "users",
      data() {
            //验证邮箱的规则
            var checkEmail = (rule, value, callback) => {
                  const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                  if (regEmail.test(value)) {
                        //验证通过合法邮箱
                        return callback();
                  }
                  callback(new Error("验证合法的邮箱"));
            };
            //验证手机号的规则
            var checkMobile = (rule, value, callback) => {
                  const regMobil = /^[1][3,4,5,7,8][0-9]{9}$/;
                  if (regMobil.test(value)) {
                        //验证通过合法手机号
                        return callback();
                  }
                  callback(new Error("请输入正确形式的手机号"));
            };
            return {
                  queryInfo: {
                        //获取用户列表的参数对象
                        query: "", //查询参数
                        pagenum: 1, //当前的页码
                        pagesize: 2 //每页显示的条数
                  },
                  userlist: [],
                  total: 0,
                  //控制添加用户的对话框的显示与隐藏
                  addDialogVisible: false,
                  //添加用户的表单数据
                  addFrom: {
                        username: "",
                        password: "",
                        email: "",
                        mobile: ""
                  },
                  //添加表单的验证规则对象
                  addFromRules: {
                        username: [
                              {
                                    required: true,
                                    message: "请输入用户名",
                                    trigger: "blur"
                              },
                              {
                                    min: 3,
                                    max: 10,
                                    message: "长度在 3 到 10 个字符",
                                    trigger: "blur"
                              }
                        ],
                        password: [
                              {
                                    required: true,
                                    message: "请输入密码",
                                    trigger: "blur"
                              },
                              {
                                    min: 6,
                                    max: 15,
                                    message: "长度在 6 到 15 个字符",
                                    trigger: "blur"
                              }
                        ],
                        email: [
                              {
                                    required: true,
                                    message: "请输入邮箱",
                                    trigger: "blur"
                              },
                              {
                                    validator: checkEmail,
                                    trigger: "blur"
                              }
                        ],
                        mobile: [
                              {
                                    required: true,
                                    message: "请输入手机号",
                                    trigger: "blur"
                              },
                              {
                                    validator: checkMobile,
                                    trigger: "blur"
                              }
                        ]
                  },
                  // 修改对话框的显示与隐藏
                  editDialogVisible: false,
                  //查询到用户信息对象
                  editFrom: {},
                  //修改表单的验证规则对象
                  editFromRules: {
                        email: [
                              {
                                    required: true,
                                    message: "请输入邮箱",
                                    trigger: "blur"
                              },
                              {
                                    validator: checkEmail,
                                    trigger: "blur"
                              }
                        ],
                        mobile: [
                              {
                                    required: true,
                                    message: "请输入手机号",
                                    trigger: "blur"
                              },
                              {
                                    validator: checkMobile,
                                    trigger: "blur"
                              }
                        ]
                  }
            };
      },
      created() {
            this.getUserList();
      },
      methods: {
            async getUserList() {
                  const { data: res } = await this.axios.get("users", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("数据获取失败");
                  }
                  this.userlist = res.data.users;
                  this.total = res.data.total;
            },
            //监听switch开关状态的改变  uld用户的参数 type代表用的状态true false
            async userStateChanged(userInfo) {
                  const { data: res } = await this.axios.put(
                        `users/${userInfo.id}/state/${userInfo.mg_state}`
                  );
                  if (res.meta.status !== 200) {
                        userInfo.mg_state = !userInfo.mg_state;
                        return this.$message.error("数据更新失败");
                  }
                  this.$message.success("更新用户状态成功");
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getUserList();
            },
            //监听页码值改变的事件
            handleCurrentChange(newPage) {
                  this.queryInfo.pagenum = newPage;
                  this.getUserList();
            },
            //监听添加用户对话框的关闭事件
            addDialogClose() {
                  this.$refs.addFromRef.resetFields();
            },
            //点击按钮添加新的用户
            addUser() {
                  this.$refs.addFromRef.validate(async valid => {
                        if (!valid) return;
                        //可以发起添加用户的网络请求
                        const { data: res } = await this.axios.post(
                              "users",
                              this.addFrom
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("添加用户失败");
                        }
                        this.$message.success("添加用户成功");
                        //隐藏添加用户列表
                        this.addDialogVisible = false;
                        //重新获取users列表
                        this.getUserList();
                  });
            },
            //展示编辑用户的对话框Dialog
            async showEditDialog(id) {
                  const { data: res } = await this.axios.get("users/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("查询用户失败");
                  }
                  this.editFrom = res.data;
                  this.editDialogVisible = true;
            },
            //监听修改用户对话框的关闭事件
            // close事件就是对话框在关闭的时候信息依旧显示
            editDialogClose() {
                  this.$refs.editFromRef.resetFields();
            },
            //点击确定按钮修改用户信息
            editUser() {
                  this.$refs.editFromRef.validate(async valid => {
                        if (!valid) return;
                        //发起修改用户信息的数据请求
                        const { data: res } = await this.axios.put(
                              "users/" + this.editFrom.id,
                              {
                                    email: this.editFrom.email,
                                    mobile: this.editFrom.mobile
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("更新用户失败");
                        }
                        this.editDialogVisible = false;
                        this.getUserList();
                        this.$message.success("查询用户成功");
                  });
            },
            // 根据id删除对应的数据
            async removeUserById(id) {
                  //弹框询问用户是否删除
                  await this.$confirm(
                        "此操作将永久删除该用户, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning" 
                        }
                  )
                        .then(() => {
                              this.$message({
                                    type: "success",
                                    message: "删除成功!"
                              });
                        })
                        .catch(() => {
                              this.$message({
                                    type: "info",
                                    message: "已取消删除"
                              });
                        });
                  const { data: res } = await this.axios.delete("users/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除用户失败！");
                  }
                  this.$message.success("删除用户成功！");
                  this.getUserList();
            }
      }
};
</script>
<style lang="less" scopet>
.el-breadcrumb {
      margin-bottom: 15px;
      font-size: 12px;
}
.el-card {
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
      margin-top: 15px;
      font-size: 12px;
}
.el-pagination {
      margin-top: 15px;
      text-align: right;
}
</style>
