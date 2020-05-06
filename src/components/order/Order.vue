<template>
      <div class="order">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-row>
                        <el-col :span="8">
                              <el-input
                                    placeholder="请输入内容"
                                    v-model="queryInfo.query"
                                    clearable
                                    @click="getOrderList"
                              >
                                    <el-button
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getOrderList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                  </el-row>
                  <el-table :data="orderList" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="订单编号" prop="order_number"></el-table-column>
                        <el-table-column label="订单价格" prop="order_price"></el-table-column>
                        <el-table-column label="是否付款">
                              <template slot-scope="scope">
                                    <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                                    <el-tag type="danger" v-else>未付款</el-tag>
                              </template>
                        </el-table-column>
                        <el-table-column label="是否发货" prop="is_send"></el-table-column>
                        <el-table-column label="下单时间" prop="create_time">
                              <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
                        </el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scope">
                                    <el-button
                                          type="primary"
                                          icon="el-icon-edit"
                                          size="mini"
                                          @click="showBox"
                                    ></el-button>
                                    <el-button
                                          type="success"
                                          icon="el-icon-location"
                                          size="mini"
                                          @click="showProgressBox"
                                    ></el-button>
                              </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                  ></el-pagination>
            </el-card>
            <el-dialog title="提示" :visible.sync="addRessdialogVisible" width="50%" @close="addRess">
                  <el-form
                        ref="addFromRef"
                        :model="addForm"
                        :rules="addFromRules"
                        label-width="100px"
                  >
                        <el-form-item label="省市区/县" prop="address1">
                              <el-cascader
                                    v-model="addForm.address1"
                                    :options="City"
                                    :props="{ expandTrigger: 'hover' }"
                              ></el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address2">
                              <el-input v-model="addForm.address2"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addRessdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addRessdialogVisible = false">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
                  <el-timeline>
                        <el-timeline-item
                              v-for="(activity, index) in progressInfo"
                              :key="index"
                              :timestamp="activity.time"
                        >{{activity.context}}</el-timeline-item>
                  </el-timeline>
            </el-dialog>
      </div>
</template>
<script>
import City from "./city.json";
export default {
      name: "order",
      data() {
            return {
                  queryInfo: {
                        query: "",
                        pagenum: 1,
                        pagesize: 10
                  },
                  total: 0,
                  orderList: [],
                  // 对话框的显示与隐藏
                  addRessdialogVisible: false,
                  // 对话框的数据对象
                  addForm: {
                        address1: "",
                        address2: ""
                  },
                  // 对话列的验证规则
                  addFromRules: {
                        address1: [
                              {
                                    required: true,
                                    message: "请选择正确的省市区",
                                    trigger: "blur"
                              }
                        ],
                        address2: [
                              {
                                    required: true,
                                    message: "请输入详细地址",
                                    trigger: "blur"
                              }
                        ]
                  },
                  City: [City],
                  // 物流进度对话框
                  progressDialogVisible: false,
                  progressInfo: []
            };
      },
      created() {
            this.getOrderList();
      },
      methods: {
            async getOrderList() {
                  const { data: res } = await this.axios.get("orders", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取订单列表失败");
                  }
                  this.orderList = res.data.goods;
                  this.total = res.data.total;
            },
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getOrderList();
            },
            handleCurrentChange(newNum) {
                  this.queryInfo.pagenum = newNum;
                  this.getOrderList();
            },
            //展示修改地址对话框
            showBox() {
                  this.addRessdialogVisible = true;
            },
            addRess() {
                  this.$refs.addForm.resetFields();
            },
            //查看物流进度对话框
            async showProgressBox() {
                  const { data: res } = await this.axios.get(
                        "/kuaidi/1106975712662"
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取物流进度失败");
                  }
                  this.progressInfo = res.data;
                  this.progressDialogVisible = true;
            }
      }
};
</script>
<style>
.el-cascader {
      width: 100%;
}
</style>
