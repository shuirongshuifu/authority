<template>
  <div class="menuWrap">
    <!-- 新增按钮和搜索框 -->
    <div class="addBtnAndSearchBox">
      <span>
        <el-button
          style="font-weight: 500"
          type="primary"
          size="small"
          icon="el-icon-refresh"
          @click="getMenu"
          >重新请求</el-button
        >
        <el-button
          style="font-weight: 500"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addMenuNode"
          >新增</el-button
        >
      </span>
      <el-input
        style="width: 240px"
        v-model.trim="searchWord"
        size="small"
        placeholder="回车Enter键 搜索名称或url"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="getMenu"
      ></el-input>
    </div>
    <br />
    <h5>
      <div>
        因为笔者只新建了两张表，所以如果更改了菜单的层级要去重新赋予一下角色相应的权限（角色管理勾选菜单即可）
      </div>
      <div>
        三张表或者五张表倒是不会这样，真正后端同事去设计权限至少都是三张表（基本上五张表的）
      </div>
    </h5>
    <br />
    <!-- 树表格 -->
    <div class="tableBox">
      <el-table
        :data="tableData"
        row-key="id"
        border
        :header-cell-style="{
          height: '48px',
          background: '#FAFAFA',
          color: '#333333',
          fontWeight: 'bold',
          fontSize: '14px',
          width: '100%',
        }"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-load="loading"
      >
        <el-table-column prop="name" label="名称" width="240"></el-table-column>
        <el-table-column prop="type" label="类型" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.type === 1 ? "菜单" : "按钮" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <span class="statusBox"
              ><span class="dot" :class="statusCom(scope.row.status)"></span>
              {{ scope.row.status === 1 ? "开启" : "关闭" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="isHidden"
          label="是否显示"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ isHiddenCom(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="url(地址栏路径)"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="cUrl"
          label="cUrl(组件路径)"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="editMenuNode(scope.row)" type="text"
              >编辑</el-button
            >
            <el-button
              @click="deleteMenuNode(scope.row.id)"
              type="text"
              style="color: red"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 回显编辑数据弹框 -->
    <my-dialog
      class="myDialogClass"
      :isShowDialog.sync="myDialogObj.isShowDialog"
      :title="myDialogObj.title"
      :isShowFoot="false"
    >
      <div class="treeMenuOperation">
        <el-form
          size="mini"
          ref="ruleForm"
          :model="form"
          label-position="right"
          label-width="85px"
          :rules="rules"
        >
          <el-form-item label="节点类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上级节点" prop="pids">
            <el-cascader
              :show-all-levels="false"
              v-model="form.pids"
              :options="treeOptions"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              clearable
              placeholder="请选择新增节点的上层节点"
            />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              clearable
              placeholder="无论菜单或是按钮都有名称"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.type == 1" label="url" prop="url">
            <el-input
              v-model="form.url"
              clearable
              placeholder="地址栏路径url，也是前端的path"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.type == 1" label="cUrl" prop="cUrl">
            <el-input
              v-model="form.cUrl"
              clearable
              placeholder="当地址栏访问url时，去对应渲染哪一个.vue文件"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
            <span class="tips"
              >【选择关闭，看不到菜单/按钮、地址栏也访问不到菜单，后端接口控制】</span
            >
          </el-form-item>
          <el-form-item label="是否显示" prop="isHidden">
            <el-radio-group v-model="form.isHidden">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">隐藏</el-radio>
            </el-radio-group>
            <span class="tips"
              >【选择关闭，看不到菜单页面、但地址栏能访问到，前端v-if控制（按钮不生效）】</span
            >
          </el-form-item>
          <el-form-item label="是否缓存" prop="isCache">
            <el-radio-group v-model="form.isCache">
              <el-radio :label="1">缓存</el-radio>
              <el-radio :label="2">不缓存</el-radio>
            </el-radio-group>
            <span class="tips"
              >【是否缓存菜单页面需使用vuex和keep-alive实现（按钮不生效）】</span
            >
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              maxlength="60"
              show-word-limit
              v-model="form.remark"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')"
              >提交</el-button
            >
            <el-button @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog.vue";
export default {
  components: { myDialog },
  data() {
    return {
      searchWord: "",
      tableData: [], // 树表格使用
      loading: false,
      form: {
        type: 1,
      },
      treeOptions: [], // cascader使用
      rules: {
        type: { required: true, message: "请选择节点类型" },
        name: { required: true, message: "请填写名称" },
        pids: { required: true, message: "请选择上级节点" },
        url: { required: true, message: "请填写url" },
        cUrl: { required: true, message: "请填写cUrl" },
        status: { required: true, message: "请选择状态" },
        isHidden: { required: true, message: "请选择页面是否显示" },
        isCache: { required: true, message: "请选择页面是否缓存" },
      },
      myDialogObj: {
        isShowDialog: false,
        title: "",
      },
    };
  },
  watch: {
    searchWord(newVal) {
      if (newVal == "") {
        this.getMenu();
      }
    },
  },
  computed: {
    statusCom() {
      return (status) => {
        return status === 1 ? "open" : "close";
      };
    },
    isHiddenCom() {
      return (row) => {
        if (row.type == 1) {
          // 菜单
          return row.isHidden === 1 ? "🤓 显示" : "🙈 隐藏";
        }
        if (row.type == 2) {
          // 按钮
          return "";
        }
      };
    },
  },
  mounted() {
    this.getMenu();
  },
  methods: {
    // 获取所有的菜单树以便树表格和cascader使用
    async getMenu() {
      this.loading = true;
      const res = await this.$auth.getAllMenu(this.searchWord);
      if (res.code == 0) {
        this.tableData = res.data;
        this.treeOptions = res.data;
        this.loading = false;
      }
    },
    // 打开弹框，新增菜单节点
    addMenuNode() {
      this.myDialogObj.isShowDialog = true;
      this.myDialogObj.title = "新增菜单节点";
    },
    // 获取数据，回显编辑菜单节点
    async editMenuNode(row) {
      if (row.id == 1) {
        this.$message({
          type: "warning",
          message: "根节点就不用编辑啦",
        });
        return;
      }
      const res = await this.$auth.queryMenuById(row.id);
      if (res.code == 0) {
        let form = res.data;
        // 回显数据pids需要的是数组，将数据库中字符串逗号分隔一下再转数字
        form["pids"] = form.pids.split(",").map((item) => {
          return Number(item);
        });
        this.form = form;
        this.myDialogObj.isShowDialog = true;
        this.myDialogObj.title = "编辑菜单节点";
      }
    },
    // 删除使用逻辑删除
    deleteMenuNode(id) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$auth.deleteMenu(id);
          if (res.code == 0) {
            this.getMenu();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {});
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.myDialogObj.title == "新增菜单节点") {
            this.addSubmit();
          } else {
            this.editSubmit();
          }
        } else {
          return false;
        }
      });
    },
    // 新增提交（可与编辑提交合在一块）
    async addSubmit() {
      let form = { ...this.form };
      form.pid = form.pids.at(-1); // 因为id是自增的，所以新增的数据一定要明晰pid是谁
      form.pids = form.pids.toString(); // pids在数据库中存储的是数组转成字符串逗号拼接的
      const res = await this.$auth.addMenu(form);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "新增成功!",
        });
        this.closeDialog();
        this.getMenu();
      }
    },
    // 编辑提交
    async editSubmit() {
      let form = { ...this.form };
      form.pid = form.pids.at(-1); // 因为id是自增的，所以新增的数据一定要明晰pid是谁
      form.pids = form.pids.toString(); // pids在数据库中存储的是数组转成字符串逗号拼接的
      const res = await this.$auth.editMenu(form);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "编辑成功!",
        });
        this.closeDialog();
        this.getMenu();
      }
    },
    // 顾名思义，关闭弹框
    closeDialog() {
      this.myDialogObj.isShowDialog = false;
      this.$refs["ruleForm"].resetFields();
      this.form = { type: 1 };
    },
  },
};
</script>

<style lang='less' scoped>
.menuWrap {
  width: 100%;
  height: auto;
  position: relative;
  .addBtnAndSearchBox {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h5 {
    color: #f56c6c;
  }
  .tableBox {
    .el-table {
      // 深度选择器，去除默认的padding，降低表格行高
      /deep/ th {
        padding: 0;
      }
      /deep/ td {
        padding: 0;
      }
    }
  }
  /deep/ .treeMenuOperation {
    box-sizing: border-box;
    padding: 12px 24px;
    .el-form {
      .el-form-item__label {
        color: #000 !important;
        font-weight: 500;
      }
      .el-radio {
        margin-right: 12px;
        .el-radio__label {
          padding-left: 4px;
        }
      }
    }
  }
  /deep/ .myDialogClass {
    .dialogBoxContent {
      width: 700px;
      height: 85%;
    }
  }
}
.statusBox {
  display: flex;
  align-items: center;
  justify-content: center;
  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
  .open {
    background-color: #409eff;
  }
  .close {
    background-color: #888;
  }
}
.tips {
  color: #999;
  font-size: 12px;
  // margin-left: 12px;
}
</style>