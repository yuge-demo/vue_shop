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
                                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
            <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
                  <!-- 内容主题区域 -->
                  <span></span>
                  <!-- 底部区域 -->
                  <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
                        <el-button @click="addDialogVisible = false" type="info">取 消</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "users",
      data() {
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
                  addDialogVisible: false
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
