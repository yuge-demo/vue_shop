<template>
      <div class="rights">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-cart>
                  <el-table :data="rightsList" border stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="authName" label="权限名称"></el-table-column>
                        <el-table-column prop="path" label="路径"></el-table-column>
                        <el-table-column prop="level" label="权限等级">
                              <template slot-scope="scope">
                                    <el-tag v-if="scope.row.level == '0'">标签一</el-tag>
                                    <el-tag type="success" v-else-if="scope.row.level == '1'">标签二</el-tag>
                                    <el-tag type="danger" v-else>标签三</el-tag>
                              </template>
                        </el-table-column>
                  </el-table>
            </el-cart>
      </div>
</template>

<script>
export default {
      name: "rights",
      //所有权列表 请求路径是 rights/:type
      //type类型值list 或者 tree list列表显示权限 tree树状显示全权限
      data() {
            return {
                  //所有权限列表
                  rightsList: []
            };
      },
      created() {
            this.getRightsList();
      },
      methods: {
            async getRightsList() {
                  const { data: res } = await this.axios.get("rights/list");
                  if (res.meta.status !== 200) {
                        this.$message.error("获取列表失败！");
                  }
                  this.rightsList = res.data;
                  console.log(this.rightsList);
            }
      }
};
</script>
<style>
</style>
