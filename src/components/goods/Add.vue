<template>
      <div class="add">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
                  <el-steps
                        :space="200"
                        :active="activeIndex - 0"
                        finish-status="success"
                        align-center
                  >
                        <el-step title="基本信息"></el-step>
                        <el-step title="商品参数"></el-step>
                        <el-step title="商品属性"></el-step>
                        <el-step title="商品图片"></el-step>
                        <el-step title="商品内容"></el-step>
                        <el-step title="完成"></el-step>
                  </el-steps>
                  <el-form
                        :model="addFrom"
                        :rules="addFromRules"
                        ref="addFromRef"
                        label-position="top"
                        label-width="100px"
                  >
                        <el-tabs
                              v-model="activeIndex"
                              :tab-position="'left'"
                              :before-leave="beforeTabLeave"
                              @tab-click="tabClicked"
                        >
                              <!-- name的值是字符串 -->
                              <el-tab-pane label="基本信息" name="0">
                                    <el-form-item label="商品名称" prop="goods_name">
                                          <el-input v-model="addFrom.goods_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品价格" prop="goods_price">
                                          <el-input v-model="addFrom.goods_price" type="number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品重量" prop="goods_weight">
                                          <el-input v-model="addFrom.goods_weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品数量" prop="goods_number">
                                          <el-input v-model="addFrom.goods_name" type="number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="goods_cat">
                                          <el-cascader
                                                v-model="addFrom.goods_cat"
                                                :options="cateList"
                                                :props="{ expandTrigger: 'hover'  ,value:'cat_id',label:'cat_name',children:'children'}"
                                                @change="handleChange"
                                          ></el-cascader>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品参数" name="1">
                                    <el-form-item
                                          :label="item.attr_name"
                                          v-for="item in manyTableData"
                                          :key="item.attr_id"
                                    >
                                          <el-checkbox-group v-model="item.attr_vals">
                                                <el-checkbox
                                                      :label="cb"
                                                      v-for="(cb , i ) in item.attr_vals"
                                                      :key="i"
                                                      border
                                                ></el-checkbox>
                                          </el-checkbox-group>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品属性" name="2">
                                    <el-form-item
                                          :label="item.attr_name"
                                          v-for="item in onlyTableData"
                                          :key="item.attr_id"
                                    >
                                          <el-input v-model="item.attr_vals"></el-input>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品图片" name="3">
                                    <!-- action 是图片要上传的API地址 -->
                                    <el-upload
                                          action="https://www.liulongbin.top:8888/api/private/v1/upload"
                                          :on-preview="handlePreview"
                                          :on-remove="handleRemove"
                                          :on-success="handleSuccess"
                                          list-type="picture"
                                          :headers="headerObj"
                                    >
                                          <el-button size="small" type="primary">点击上传</el-button>
                                          <div
                                                slot="tip"
                                                class="el-upload__tip"
                                          >只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                              </el-tab-pane>
                              <el-tab-pane label="商品内容" name="4">
                                    <quill-editor
                                          ref="myQuillEditor"
                                          v-model="addFrom.goods_introduce"
                                    ></quill-editor>
                                    <el-button type="primary" class="ql-button" @click="add">添加商品</el-button>
                              </el-tab-pane>
                        </el-tabs>
                  </el-form>
            </el-card>
            <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
                  <img :src="previewPath" class="previewImg" />
            </el-dialog>
      </div>
</template>

<script>
import _ from "lodash";
export default {
      name: "add",
      data() {
            return {
                  activeIndex: "0",
                  //表单验证规则对象
                  addFrom: {
                        good_name: "",
                        goods_price: 0,
                        goods_weight: "",
                        goods_number: 0,
                        // 商品所属分类数组
                        goods_cat: [],
                        // 图片数组
                        pics: [],
                        //商品详情描述
                        goods_introduce: "",
                        attrs: []
                  },
                  //表单验证规则对象
                  addFromRules: {
                        good_name: [
                              {
                                    required: true,
                                    message: "请输入商品名称",
                                    trigger: "blur"
                              }
                        ],
                        goods_price: [
                              {
                                    required: true,
                                    message: "请输入商品价格",
                                    trigger: "blur"
                              }
                        ],
                        goods_weight: [
                              {
                                    required: true,
                                    message: "请输入商品重量",
                                    trigger: "blur"
                              }
                        ],
                        goods_number: [
                              {
                                    required: true,
                                    message: "请输入商品数量",
                                    trigger: "blur"
                              }
                        ],
                        goods_cat: [
                              {
                                    required: true,
                                    message: "请选择商品分类",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //保存商品列表数据
                  cateList: [],
                  //级联选择框的数据
                  cascader: {},
                  //动态参数的数据 （保存）
                  manyTableData: [],
                  // 静态参数列表的数据（保存）
                  onlyTableData: [],
                  // 图片上传组件的headers请求头对象
                  headerObj: {
                        Authorization: window.sessionStorage.getItem("token")
                  },
                  previewPath: "",
                  //图片预览对话框
                  previewDialogVisible: false
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            async getCateList() {
                  const { data: res } = await this.axios.get("categories");
                  if (res.meta.status !== 200) {
                        return this.$message.erroe("获取商品列表失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.cateList = res.data;
            },
            // 级联选择器发生变化的时候会触发这个函数
            handleChange() {
                  console.log(this.addFrom.goods_cat);
                  if (this.addFrom.goods_cat.length !== 3) {
                        this.addFrom.goods_cat = [];
                  }
            },
            // after 即将进入 befove 即将离开
            beforeTabLeave(after, before) {
                  if (before === "0" && this.addFrom.goods_cat.length !== 3) {
                        this.$message.error("商品分类失败");
                        return false;
                  }
            },
            // tab 被选中时触发
            async tabClicked() {
                  if (this.activeIndex === "1") {
                        const { data: res } = await this.axios.get(
                              `categories/${this.cateId}/attributes`,
                              {
                                    params: { sel: "many" }
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("获取参数列表失败");
                        }
                        res.data.forEach(item => {
                              item.attr_vals =
                                    item.attr_vals.length === 0
                                          ? []
                                          : item.attr_vals.split("");
                        });
                        this.manyTableData = res.data;
                        console.log(this.manyTableData);
                  } else if (this.activeIndex === "2") {
                        const { data: res } = await this.axios.get(
                              `categories/${this.cateId}/attributes`,
                              {
                                    params: { sel: "only" }
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("获取参数列表失败");
                        }
                        this.onlyTableData = res.data;
                        console.log(this.onlyTableData);
                  }
            },
            //处理图片预览效果
            handlePreview(file) {
                  this.previewPath = file.response.data.url;
                  this.previewDialogVisible = true;
            },
            //移除图片的效果
            handleRemove(file) {
                  //  1 获取将要删除的图片的临时路径
                  const filePath = file.data.response.tmp_path;
                  //  2 从pics数组中找到这个图片对应的索引值
                  const i = this.addFrom.pics.findIndex(
                        x => x.pic === filePath
                  );
                  //  3 调用数组的splice方法 把图片信息对象 从pics数组中删除
                  this.addFrom.pics.splice(i, 1);
            },
            //监听图片上传成功事件
            handleSuccess(response) {
                  //  首先 拼接得到一个图片信息对象
                  const picInfo = { pic: response.data.tmp_path };
                  // 然后将信息对象 ，push 到 pics 数组中
                  this.addFrom.pics.push(picInfo);
            },
            //添加商品
            add() {
                  this.$refs.addFromRef.validate(async valid => {
                        if (!valid) {
                              return this.$message.error("请填写必要的表单项");
                        }
                        //深拷贝 lodash  cloneDeep(obj)
                        const from = _.cloneDeep(this.addFrom);
                        from.goods_cat = from.goods_cat.join("");
                        //处理静态参数
                        this.manyTableData.forEach(item => {
                              const newInfo = {
                                    attr_id: item.attr_id,
                                    attr_value: item.attr_vals.join("")
                              };
                              this.addFrom.attrs.push(newInfo);
                        });
                        //静态属性参数
                        this.onlyTableData.forEach(item => {
                              const newInfo = {
                                    attr_id: item.attr_id,
                                    attr_value: item.attr_vals.join("")
                              };
                              this.addFrom.attrs.push(newInfo);
                        });
                        from.attrs = this.addFrom.attrs;

                        const { data: res } = await this.axios.post(
                              "goods",
                              from
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("添加商品失败");
                        }
                        return this.$message.success(res.msg.success);
                        this.$router.push("/goods");
                  });
            }
      },
      computed: {
            cateId() {
                  if (this.addFrom.goods_cat.length === 3) {
                        return this.addFrom.goods_cat[2];
                  }
                  return null;
            }
      }
};
</script>
<style>
.el-steps {
      margin-top: 15px;
      font-size: 13px;
}
.el-checkbox {
      margin: 0 5px 0 0 !important;
}
.previewImg {
      width: 100%;
}
.ql-editor {
      min-height: 300px;
      margin-bottom: 15px;
}
</style>
