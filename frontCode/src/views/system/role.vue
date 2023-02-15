<template>
  <div class="roleWrap">
    <div class="roleSearchAndAdd">
      <span>
        <el-button
          type="primary"
          size="mini"
          @click="addRole"
          icon="el-icon-plus"
          >新增角色</el-button
        >
      </span>
      <el-input
        style="width: 240px"
        v-model.trim="searchWord"
        size="mini"
        placeholder="回车Enter键 搜索角色信息"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="getTableData"
      ></el-input>
    </div>
    <br />
    <h3 style="color: #f0f">
      大家不要修改笔者的超级管理员角色，可以自己新建角色，然后赋予菜单权限看效果
    </h3>
    <br />
    <div class="roleTable">
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
        v-load="loading"
      >
        <el-table-column
          type="index"
          width="120"
          label="角色序号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="menuIds"
          label="角色菜单id"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleRemark"
          label="角色备注"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.id == 1"
              @click="editRole(scope.row)"
              type="text"
              >编辑</el-button
            >
            <el-button
              :disabled="scope.row.id == 1"
              @click="deleteRole(scope.row.roleId)"
              type="text"
              :style="{
                color: scope.row.id == 1 ? '' : 'red',
              }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :title="drawerObj.title"
      :visible.sync="drawerObj.drawer"
      direction="rtl"
    >
      <span class="drawTitle" slot="title">
        {{ drawerObj.title }}
      </span>
      <div class="drawContent">
        <div class="drawContentItem">
          <div class="label">角色名称</div>
          <el-input
            v-model="roleObj.roleName"
            size="small"
            placeholder="请填写角色名称(必填)"
            clearable
          ></el-input>
        </div>
        <div class="drawContentItem">
          <div class="label">角色备注</div>
          <el-input
            v-model="roleObj.roleRemark"
            size="small"
            placeholder="请填写角色备注(选填)"
            clearable
          ></el-input>
        </div>
        <div class="drawContentTree">
          <div class="info">
            <span>
              <div>给角色赋予菜单/按钮权限</div>
              <div class="info2">树结构勾选</div>
            </span>
            <el-button
              icon="el-icon-finished"
              size="mini"
              type="primary"
              @click="valideteSaveRoleRight"
              >保存</el-button
            >
          </div>
          <el-tree
            :props="propsSetting"
            show-checkbox
            :data="menuTreeList"
            ref="tree"
            node-key="id"
            :check-strictly="false"
            :default-checked-keys="checked_keys"
            default-expand-all
            @check="checkTree"
          ></el-tree>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      propsSetting: {
        value: "id",
        label: "name",
        children: "children",
        disabled: (data, node) => {
          return data.status == 2 ? true : false; // 状态为2的禁用（关闭），为1的正常
        },
      },
      searchWord: "",
      tableData: [],
      loading: false,
      drawerObj: {
        title: "", // 编辑
        drawer: false,
      },
      roleObj: {
        roleName: "",
        roleRemark: "",
      },
      menuTreeList: [
        // {
        //   id: "1",
        //   name: "中国",
        //   children: [
        //     {
        //       id: "3",
        //       name: "北京",
        //     },
        //     // {
        //     //   id: "4",
        //     //   name: "上海",
        //     // },
        //   ],
        // },
        // {
        //   id: "2",
        //   name: "美国",
        //   children: [
        //     {
        //       id: "5",
        //       name: "华盛顿",
        //     },
        //     {
        //       id: "6",
        //       name: "纽约",
        //     },
        //   ],
        // },
      ],
      // 用于编辑时回显勾选了哪些树节点
      checked_keys: [],
      hasCheckedKeys: [],
    };
  },
  created() {
    this.getTableData();
    this.getMenu();
  },
  watch: {
    searchWord(newVal) {
      if (newVal == "") {
        this.getTableData();
      }
    },
  },
  methods: {
    // 列表数据
    async getTableData() {
      this.loading = true;
      const res = await this.$auth.listRoles(this.searchWord);
      if (res.code == 0) {
        this.tableData = res.data;
        this.loading = false;
      }
    },
    // 获取所有的菜单树以便树表格和cascader使用
    async getMenu() {
      const res = await this.$auth.getAllMenu(this.searchWord);
      if (res.code == 0) {
        this.menuTreeList = res.data;
      }
    },
    // 新增打开角色抽屉弹框
    addRole() {
      this.drawerObj.title = "添加角色权限";
      this.drawerObj.drawer = true;
    },
    // 编辑打开角色抽屉弹框（顺带回显数据）
    editRole(row) {
      console.log("row", row);
      if (row.roleId === 29) {
        this.$message({
          type: "error",
          message: "超级管理员不允许编辑，请自己新建角色并赋予菜单树权限",
          duration: 5000,
        });
        return;
      }
      // this.reset()
      this.drawerObj.title = "编辑角色权限";
      this.drawerObj.drawer = true;
      // 回显普通信息
      let echoRole = { ...row };
      this.roleObj.roleName = echoRole.roleName;
      this.roleObj.roleRemark = echoRole.roleRemark;
      this.roleObj.roleId = echoRole.roleId;
      // 回显树勾选信息，参见：https://blog.csdn.net/qq_38157825/article/details/114932987
      if (echoRole.menuIds == "") {
        return;
      }
      this.echoTree(echoRole.menuIds.split(","));
    },
    // 回显树方法，带有半勾选状态
    echoTree(menuIds) {
      this.$nextTick(() => {
        const arr = [];
        menuIds.forEach((id) => {
          if (
            !this.$refs.tree.getNode(id).childNodes ||
            !this.$refs.tree.getNode(id).childNodes.length
          ) {
            arr.push(id);
          }
        });
        this.$refs.tree.setCheckedKeys(arr);
      });
    },
    // 删除角色
    deleteRole(roleId) {
      this.$confirm("请确认是否删除角色?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$auth.deleteRole(roleId);
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableData();
          }
        })
        .catch(() => {});
    },
    // 保存角色信息前的校验
    async valideteSaveRoleRight() {
      if (this.roleObj.roleName == "") {
        this.$message({
          type: "warning",
          message: "角色名必须填写(备注可以不填写)",
        });
        return;
      }
      this.saveRoleRight();
    },
    // 保存角色信息
    async saveRoleRight() {
      if (this.drawerObj.title == "添加角色权限") {
        let params = {
          roleName: this.roleObj.roleName,
          roleRemark: this.roleObj.roleRemark,
          menuIds: this.hasCheckedKeys.toString(),
        };
        const res = await this.$auth.addRole(params);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "角色新增成功",
          });
          this.getTableData();
          this.reset();
        }
      }
      if (this.drawerObj.title == "编辑角色权限") {
        let params = {
          roleId: this.roleObj.roleId,
          roleName: this.roleObj.roleName,
          roleRemark: this.roleObj.roleRemark,
          menuIds: this.hasCheckedKeys.toString(),
        };
        const res = await this.$auth.editRole(params);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "角色编辑成功",
          });
          this.getTableData();
          this.reset();
        }
      }
    },
    // 树的勾选
    checkTree(treeItemObj, checkNode) {
      /**
       * 树节点有三种状态：1. 未勾选状态、2.已勾选状态、3.半勾选状态（有子节点被勾选了，但并非所有的子节点都被勾选了）
       *                  这里勾选的数据hasCheckedKeys里 包括已勾选的，和半勾选的
       * */
      // this.hasCheckedKeys = checkNode.checkedKeys;
      this.hasCheckedKeys = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys(),
      ];
    },
    // 初始化清空
    reset() {
      this.drawerObj.drawer = false;
      this.hasCheckedKeys = [];
      this.roleObj = {
        roleName: "",
        roleRemark: "",
      };
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>

<style lang='less' scoped>
.roleWrap {
  width: 100%;
  height: 100%;
  /* background-color: pink; */
  .roleSearchAndAdd {
    width: 100%;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }
  .roleTable {
    .el-table {
      // 深度选择器，去除默认的padding，降低表格行高
      /deep/ th {
        padding: 6px;
      }
      /deep/ td {
        padding: 6px;
      }
    }
  }
  .drawTitle {
    color: #000;
    font-weight: 600;
    position: relative;
    .closeBtn {
      left: 50%;
      transform: translateY(-50%);
      position: absolute;
    }
  }
  .drawContent {
    width: 100%;
    height: auto;
    .drawContentItem {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      box-sizing: border-box;
      padding-right: 18px;
      .label {
        width: 100px;
        font-weight: 600;
        font-size: 13px;
        text-align: center;
      }
    }
    .drawContentTree {
      box-sizing: border-box;
      padding: 12px;
      .info {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info2 {
          color: #999;
          font-weight: 100;
        }
      }
    }
  }
}
</style>