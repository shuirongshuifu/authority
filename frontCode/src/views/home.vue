<template>
  <div>
    <el-button
      @click="allVueRouterInScopes"
      size="small"
      type="primary"
      plain
      icon="el-icon-right"
      style="margin-bottom: 12px"
      >点击，控制台查看所有路由</el-button
    >
    <br />
    <el-button
      @click="elMenuTree"
      size="small"
      type="primary"
      plain
      style="margin-bottom: 12px"
      icon="el-icon-right"
      >el-menu需要的菜单树</el-button
    >
    <br />
    <el-button
      @click="vueRouterTree"
      size="small"
      type="primary"
      plain
      style="margin-bottom: 12px"
      icon="el-icon-right"
      >vue-router需要的路由树（表）</el-button
    >
    <br />
    <el-button
      @click="btnTree"
      size="small"
      type="primary"
      plain
      style="margin-bottom: 12px"
      icon="el-icon-right"
      >按钮需要的按钮菜单树</el-button
    >
    <br />
    <br />
    <code class="codeC">
      所有菜单结构如下：
      <pre>
          首页
          前端框架
              vue页面
              react页面
              angular
                  agl1
                  agl2
          后端框架
              springBoot
              myBatis
              特工001
              特工002
          系统设置
              角色管理
              菜单管理
      </pre>
    </code>
  </div>
</template>

<script>
export default {
  methods: {
    allVueRouterInScopes() {
      console.log("查看作用域中的所有的路由：[[Scopes]].[0].pathList");
      console.dir(this.$router.matcher.addRoutes);
      // https://segmentfault.com/q/1010000039132425/a-1020000039132712
      // https://www.cnblogs.com/forever-Ys/p/10091422.html
    },
    elMenuTree() {
      console.log("el-menu需要的菜单树", this.$store.state.menu.menuTree);
    },
    vueRouterTree() {
      console.log(
        "vue-router需要的路由树（表）",
        this.$store.state.menu.routerTree
      );
    },
    btnTree() {
      console.log(
        "按钮需要的按钮菜单树",
        JSON.parse(sessionStorage.getItem("btnAuthObj"))
      );
    },
  },
};
</script>

<style>
.codeC {
  font-weight: 700;
}
</style>