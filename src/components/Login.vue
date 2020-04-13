<template>
      <div class="login_container">
            <div class="login_box">
                  <div class="avatar_box">
                        <img src="./../assets/logo.png" />
                  </div>
                  <!-- ref是表单的实例对象 -->
                  <el-form
                        ref="loginFromRef"
                        :rules="loginFromRules"
                        :model="loginFrom"
                        label-width="0"
                        class="login_form"
                  >
                        <el-form-item prop="username">
                              <el-input
                                    v-model="loginFrom.username"
                                    prefix-icon="iconfont icontouxiang"
                              ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                              <el-input
                                    v-model="loginFrom.password"
                                    prefix-icon="iconfont iconsuo"
                                    type="password"
                              ></el-input>
                        </el-form-item>
                        <el-form-item class="btns">
                              <el-button type="primary" @click="login">登录</el-button>
                              <el-button type="info" @click="resetLoginFrom">重置</el-button>
                        </el-form-item>
                  </el-form>
            </div>
      </div>
</template>

<script>
export default {
      name: "login",
      data() {
            return {
                  // 登录表单的数据绑定对象
                  loginFrom: {
                        username: "admin",
                        password: "123456"
                  },
                  // 表单的验证规则  用户名和密码的验证规则
                  loginFromRules: {
                        username: [
                              {
                                    required: true,
                                    message: "请输入登录名称",
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
                                    min: 3,
                                    max: 10,
                                    message: "长度在 6 到 10 个字符",
                                    trigger: "blur"
                              }
                        ]
                  }
            };
      },
      methods: {
            // 点击重置按钮，重置登录表单
            resetLoginFrom() {
                  // console.log(this)  this对应的ref
                  this.$refs.loginFromRef.resetFields();
            },
            login() {
                  this.$refs.loginFromRef.validate(async valid => {
                        // console.log(valid)
                        if (!valid) return;
                        const { data: res } = await this.axios.post(
                              "login",
                              this.loginFrom
                        );
                        if (res.meta.status != 200)
                              return this.$message.error("登录失败");
                        this.$message.success("登录成功");
                        //1 将登录成功之后的 token ， 保存倒客户端的 sessionStorage 中
                        //   1.1 项目中的除了登录之外的其他API接口，必须在登录之后才能访问
                        //   1.2 token 只应在当前的网站打开期间生效，所以将token 保存早sessionStorage 中
                        window.sessionStorage.setItem("token", res.data.token);
                        //2 通过编程式导航跳转到后台主页，路由地址是 /home
                        this.$router.push("/home");
                  });
            }
      }
};
</script>
<style lang="less" scoped>
.login_container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #2b4b6b;
}
.login_box {
      width: 450px;
      height: 300px;
      background-color: #ffffff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
}
.avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #dddddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;
      // top: -75px;
      img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
      }
}
.login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
}
.btns {
      // text-align: right;
      display: flex;
      justify-content: flex-end;
}
</style>
