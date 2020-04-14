<template>
      <el-container class="home-container">
            <el-header>
                  <div>
                        <img src="../assets/logo.png" alt />
                        <span>电商后台管理系统</span>
                  </div>
                  <el-button type="info" @click="exit">退出</el-button>
            </el-header>
            <el-container>
                  <!-- 侧边栏菜单区域 -->
                  <el-aside :width="isCollapse ? '64px' : '200px'">
                        <div class="toggle-button" @click="toggleCollapse">|||</div>
                        <el-menu
                              background-color="#333744"
                              text-color="#fff"
                              active-text-color="#409eff"
                              unique-opened
                              :collapse="isCollapse"
                              :collapse-transition="false"
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
                                    <el-menu-item
                                          :index="subItem.id+''"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                    >
                                          <template slot="title">
                                                <i class="el-icon-menu"></i>
                                                <span>{{subItem.authName}}</span>
                                          </template>
                                    </el-menu-item>
                              </el-submenu>
                        </el-menu>
                  </el-aside>
                  <el-main>Main</el-main>
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
                  isCollapse: false
            };
      },
      created() {
            this.getMenuList();
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