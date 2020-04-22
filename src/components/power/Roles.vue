<template>
      <div class="roles">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-row>
                        <el-col>
                              <el-button type="primary">添加角色</el-button>
                        </el-col>
                  </el-row>
                  <el-table :data="roleList" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                              <template slot-scope="scope">
                                    <el-row
                                          class="vcenter"
                                          :class="['bdbottom' , i === 0 ? 'bdtop' : '']"
                                          v-for="(item1 , i) in scope.row.children"
                                          :key="item1.id"
                                    >
                                          <!-- 渲染一级权限 -->
                                          <el-col :span="5">
                                                <el-tag
                                                      closable
                                                      @close="removeRightById(scope.row,item1.id)"
                                                >{{item1.authName}}</el-tag>
                                                <i class="el-icon-caret-right"></i>
                                          </el-col>
                                          <!-- 渲染二级权限 -->
                                          <el-col :span="19">
                                                <!-- 二级权限的for循环 -->
                                                <el-row
                                                      class="vcenter"
                                                      :class="[ j === 0 ? '' : 'bdtop' ]"
                                                      v-for="(item2,j) in item1.children"
                                                      :key="item2.id"
                                                >
                                                      <el-col :span="6">
                                                            <el-tag
                                                                  closable
                                                                  @close="removeRightById(scope.row,item2.id)"
                                                                  type="success"
                                                            >{{item2.authName}}</el-tag>
                                                            <i class="el-icon-caret-right"></i>
                                                      </el-col>
                                                      <el-col :span="18">
                                                            <el-tag
                                                                  type="warning"
                                                                  :class="[ k === 0 ? '' : 'bdtop'] "
                                                                  v-for="(item3,k) in item1.children"
                                                                  :key="item3.id"
                                                                  closable
                                                                  @close="removeRightById(scope.row,item3.id)"
                                                            >{{item3.authName}}</el-tag>
                                                      </el-col>
                                                </el-row>
                                          </el-col>
                                    </el-row>
                                    <!-- <pre>{{scope.row}}</pre> -->
                              </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="roleName" label="角色名称"></el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scope">
                                    <el-button
                                          size="mini"
                                          type="primary"
                                          icon="el-icon-edit"
                                          @click="editRoleById(scope.row.id)"
                                    >编辑</el-button>
                                    <el-button
                                          size="mini"
                                          type="danger"
                                          icon="el-icon-delete"
                                          @click="removeRoleById(scope.row.id)"
                                    >删除</el-button>
                                    <el-button
                                          size="mini"
                                          type="warning"
                                          icon="el-icon-setting"
                                          @click="showSetRightDialog(scope.row)"
                                    >分配权限</el-button>
                              </template>
                        </el-table-column>
                  </el-table>
            </el-card>
            <!-- 编辑角色对话框 -->
            <el-dialog title="修改角色" width="50%" :visible.sync="editdialogVisible">
                  <el-from :model="editFrom" label-width="70px">
                        <el-form-item label="角色名称">
                              <el-input v-model="editFrom.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述">
                              <el-input v-model="editFrom.roleDesc"></el-input>
                        </el-form-item>
                  </el-from>
                  <div slot="footer" class="dialog-footer">
                        <el-button @click="editdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
                  </div>
            </el-dialog>
            <!-- 分配权限的对话框 -->
            <el-dialog
                  title="提示"
                  :visible.sync="SetRightDialogVisible"
                  width="50%"
                  @close="SetRightDialogClosed"
            >
                  <!-- 树形空间 -->
                  <el-tree
                        :data="rightsList"
                        :props="treeProps"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="defKeys"
                  ></el-tree>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="SetRightDialogVisible = false">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "roles",
      data() {
            return {
                  //所有角色的列表的数据
                  roleList: [],
                  //控制分配权限的显示与隐藏
                  SetRightDialogVisible: false,
                  //所有权限的数据
                  rightsList: "",
                  //树形空间属性绑定对象
                  treeProps: {
                        label: "authName",
                        children: "children"
                  },
                  //默认选中节点id值
                  defKeys: [],
                  // 控制编制角色的显示与隐藏
                  editdialogVisible: false,
                  //用户信息对象
                  editFrom: {}
            };
      },
      created() {
            this.getRolesList();
      },
      methods: {
            async getRolesList() {
                  const { data: res } = await this.axios.get("roles");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取角色列表失败！");
                  }
                  this.roleList = res.data;
                  // console.log(this.roleList);
            },
            //根据id删除item3权限的内容
            async removeRightById(role, rightId) {
                  //弹框提示用户是否需要需要删除
                  await this.$confirm(
                        "此操作将永久删除该权限, 是否继续?",
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
                  //删除的请求路径roles/:roleld/rights/:rightId     请求方法是delete
                  //:roleId 角色Id  :rightId 权限Id
                  const { data: res } = await this.axios.delete(
                        `roles/${role.id}/rights/${rightId}`
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取角色权限失败！");
                  }
                  role.children = res.data;
                  //使用这种渲染页面会使页面从新的刷新会关闭表也权限的内容
                  // this.getRolesList();
            },
            //编辑角色
            editRoleById(id) {
                  this.editdialogVisible = true;
            },
            //删除角色
            async removeRoleById(id) {
                  //弹框提示用户是否需要需要删除
                  await this.$confirm(
                        "此操作将永久删除该角色, 是否继续?",
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
                  const { data: res } = await this.axios.delete("roles/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("角色删除失败！");
                  }
                  this.$message.success("角色删除成功！");
                  this.getRolesList();
            },
            //展示分配权限的对话框
            async showSetRightDialog(role) {
                  //获取所有权限的数据
                  const { data: res } = await this.axios.get("rights/tree");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取权限数据失败");
                  }
                  //获取道德权限数据保存到data中
                  this.rightsList = res.data;
                  //使用递归获取三级节点id
                  this.getLeafKeys(role, this.defKeys);
                  this.SetRightDialogVisible = true;
            },
            //通过递归函数的形式，获取角色下所有三级权限的id，并保存到defKey数组中
            getLeafKeys(node, arr) {
                  //node节点  arr数组保存
                  if (!node.children) {
                        //如果当前node节点不包含children属性则是三级节点
                        return arr.push(node.id);
                  }
                  node.children.forEach(item => this.getLeafKeys(item, arr));
            },
            //监听分配权限对话框的关闭
            SetRightDialogClosed() {
                  this.defKeys = [];
            }
      }
};
</script>
<style>
.el-tag {
      margin: 7px;
}
.bdtop {
      border-top: 1px solid #eeeeee;
}
.bdbottom {
      border-bottom: 1px solid #eeeeee;
}
.vcenter {
      display: flex;
      align-items: center;
}
</style>
