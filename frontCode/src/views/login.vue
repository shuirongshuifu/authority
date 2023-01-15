<template>
  <div class="loginBox">
    <div class="loginContent">
      <el-select
        clearable
        size="small"
        v-model="value"
        placeholder="请选择角色登录"
        @visible-change="
          (flag) => {
            if (flag) {
              listRoles();
            }
          }
        "
      >
        <el-option
          v-for="item in roleList"
          :key="item.value"
          :label="item.roleName + ' (' + item.roleRemark + ')'"
          :value="item.menuIds"
        >
        </el-option>
      </el-select>
      <br />
      <span>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-thumb"
          @click="loginIn"
          :disabled="value.length == 0"
          >点击登录</el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
export default {
  name: "login",
  data() {
    return {
      value: "",
      // 角色列表，不同角色能看到的菜单是不一样的
      roleList: [],
    };
  },
  created() {
    this.listRoles();
  },
  methods: {
    async listRoles() {
      const res = await this.$auth.listRoles();
      if (res.code == 0) {
        this.roleList = res.data;
      }
    },
    async loginIn() {
      const res = await this.$store.dispatch("menu/tree_menu", this.value);
      if (res.code == 0) {
        /**
         * 登录成功以后也要动态添加一下路由tip1，或者异步重加载一下tip2
         * 否则会出现首次登录router.beforeEach中动态路由方法不触发
         * 即首次登录点击动态菜单部分出现空白页（刷新后正常）
         * */
        router.addRoutes(store.state.menu.routerTree); // tip1: 注掉效果明显
        let i = this.roleList.findIndex((item) => {
          return item.menuIds == this.value;
        });
        sessionStorage.setItem("username", this.roleList[i].roleName);
        this.$message({
          type: "success",
          message: "登录成功",
        });
        // return
        this.$router.push({
          path: "/",
        });
        // setTimeout(() => { // tip2:注掉效果明显
        //   location.reload();
        // }, 10);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.loginBox {
  width: 100%;
  height: 100%;
  background-color: #e9e9e9;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginContent {
    width: 320px;
    height: 240px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
}
</style>
