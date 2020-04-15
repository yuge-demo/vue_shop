<template>
      <el-container class="home-container">
            <el-header>
                  <div>
                        <router-link to="/welcome">
                              <img src="../assets/logo.png" alt />
                        </router-link>
                        <span>电商后台管理系统</span>
                  </div>
                  <el-button type="info" @click="exit">退出</el-button>
            </el-header>
            <el-container>
                  <!-- 侧边栏菜单区域 -->
                  <!-- 一级菜单 -->
                  <el-aside :width="isCollapse ? '64px' : '200px'">
                        <div class="toggle-button" @click="toggleCollapse">|||</div>
                        <el-menu
                              background-color="#333744"
                              text-color="#fff"
                              active-text-color="#409eff"
                              unique-opened
                              :collapse="isCollapse"
                              :collapse-transition="false"
                              :router="true"
                              :default-active="activePath"
                        >
                              <el-submenu
                                    :index="item.id + '' "
                                    v-for="item in menulist"
                                    :key="item.id"
                              >
                                    <template slot="title">
                                          <i :class="iconsObj[item.id]"></i>
                                          <span>{{item.authName}}</span>
                                    </template>
                                    <!-- 二级菜单 -->
                                    <el-menu-item
                                          :index="'/'+subItem.path"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                          @click="saveNavState('/'+subItem.path)"
                                    >
                                          <template slot="title">
                                                <i class="el-icon-menu"></i>
                                                <span>{{subItem.authName}}</span>
                                          </template>
                                    </el-menu-item>
                              </el-submenu>
                        </el-menu>
                  </el-aside>
                  <el-main>
                        <router-view></router-view>
                  </el-main>
            </el-container>
      </el-container>
</template>

<script>
export default {
      name: "home",
      data() {
            return {
                  //左侧菜单数据
                  menulist: [],
                  iconsObj: {
                        "125": "iconfont iconicon_users",
                        "103": "iconfont icontijikongjian",
                        "101": "iconfont iconshangpingouwudai2",
                        "102": "iconfont icondingdan",
                        "145": "iconfont iconicon-test"
                  },
                  //是否折叠
                  isCollapse: false,
                  //被激活的链接地址
                  activePath: ""
            };
      },
      created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem("activePath");
      },
      methods: {
            exit() {
                  window.sessionStorage.clear("token");
                  this.$router.push("/login");
            },
            //获取菜单列表
            async getMenuList() {
                  const { data: res } = await this.axios.get("menus");
                  if (res.meta.status !== 200)
                        return this.$message.error(res.meta.msg);
                  this.menulist = res.data;
            },
            //点击按钮，切换菜单的折叠与展开
            toggleCollapse() {
                  this.isCollapse = !this.isCollapse;
            },
            //保存链接的激活状态
            saveNavState(activePath) {
                  window.sessionStorage.setItem("activePath", activePath);
                  this.activePath = activePath;
            }
      }
};
</script>
<style lang="less" scoped>
.home-container {
      height: 100%;
}
.el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;
      color: #ffffff;
      font-size: 20px;
      div {
            display: flex;
            align-items: center;
            img {
                  height: 60px;
            }
            span {
                  margin-left: 15px;
            }
      }
}
.el-aside {
      background-color: #333744;
      .el-menu {
            border-right: none;
      }
}
.el-main {
      background-color: #eaedf1;
}
.iconfont {
      margin-right: 10px;
}
.toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #ffffff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
}
</style>