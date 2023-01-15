<template>
  <div class="layoutWrap">
    <div class="left">
      <el-menu
        ref="elMenu"
        :collapse="isCollapse"
        :default-active="activeIndex"
        class="elMenu"
        background-color="#333"
        text-color="#B0B0B2"
        active-text-color="#fff"
        :unique-opened="false"
        router
        @select="menuSelect"
      >
        <!-- 普通菜单（前端写死，如首页、欢迎页等） -->
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- 递归动态菜单（后端返回，不同角色菜单不一致） -->
        <myitem :data="menuArr"></myitem>
      </el-menu>
    </div>
    <div class="right">
      <div class="rightTop">
        <i
          :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
          @click="isCollapse = !isCollapse"
        ></i>
        <h3>
          登录角色：<span class="usernameC">{{ username }}</span>
        </h3>
        <el-button
          icon="el-icon-circle-close"
          size="mini"
          type="primary"
          plain
          @click="loginOut"
          >登出</el-button
        >
      </div>
      <div class="rightBottom">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import myitem from "./components/myitem.vue";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    myitem,
  },
  data() {
    return {
      isCollapse: false,
      activeIndex: "/", // 默认是首页高亮，不过首页会重定向到home页
      // 然后再通过权限管理页面，去添加或修改这个树结构，这样的话，前端就会呈现出来了
      qmenuArr2: [
        {
          name: "前端三大框架",
          url: "前端三大框架",
          icon: "el-icon-location-information",
          children: [
            {
              name: "vue页面",
              url: "/vue",
              icon: "el-icon-star-off",
            },
            {
              name: "react页面",
              url: "/react",
              icon: "el-icon-star-off",
            },
            {
              name: "angular页面",
              url: "/angular",
              icon: "el-icon-star-off",
            },
          ],
        },
        {
          name: "后端两大框架",
          url: "后端两大框架",
          icon: "el-icon-location",
          children: [
            {
              name: "Spring Boot页面",
              url: "/springBoot",
              icon: "el-icon-star-off",
            },
            {
              name: "Spring页面",
              url: "Spring页面", // 有children，name和url就保持一致；没有的话，url的值就是路由表中用到的，不保持一致也行，因为不会用到
              icon: "el-icon-star-off",
              children: [
                {
                  name: "MySql页面",
                  url: "/mysql",
                  icon: "el-icon-star-off",
                },
                {
                  name: "Redis页面",
                  url: "/redis",
                  icon: "el-icon-star-off",
                },
              ],
            },
            {
              name: "Mybatis页面",
              url: "/mybatis",
              icon: "el-icon-star-off",
            },
          ],
        },
        {
          name: "系统设置",
          url: "系统设置",
          icon: "el-icon-setting",
          children: [
            {
              name: "用户设置",
              url: "/user",
              icon: "el-icon-user",
            },
            {
              name: "角色设置",
              url: "/role",
              icon: "el-icon-s-custom",
            },
            {
              name: "菜单设置",
              url: "/menu",
              icon: "el-icon-menu",
            },
          ],
        },
      ],
      menuArr: this.$store.state.menu.menuTree,
      username: sessionStorage.getItem("username"),
    };
  },
  // computed: {
  //   ...mapState({
  //     menuArr: (state) => state.menu.menuTree,
  //   }),
  // },
  mounted() {
    this.activeIndex = this.$route.path == "/home" ? "/" : this.$route.path;
  },
  methods: {
    menuSelect(index) {
      this.activeIndex = index;
    },
    async loginOut() {
      await this.$store.dispatch("menu/login_out");
      this.$message({
        type: "success",
        message: "退出成功",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.layoutWrap {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .left {
    width: auto;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    background-color: rgb(51, 51, 51);
    box-sizing: border-box;
    padding-right: 1px;
  }
  .right {
    flex: 1;
    height: 100%;
    overflow-x: auto; // 横向滚动要加
    display: flex;
    flex-direction: column;
    .rightTop {
      width: 100%;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 12px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 8%);
      i {
        font-size: 24px;
        cursor: pointer;
      }
      .usernameC {
        font-size: 32px;
        color: blueviolet;
        font-weight: 700;
        font-family: "楷体";
      }
    }
    .rightBottom {
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      padding: 12px;
      padding-bottom: 24px;
      background-color: #eef0f3;
      overflow-y: auto;
    }
  }
}

/*官方设置的不折叠时菜单的宽度*/
.el-menu:not(.el-menu--collapse) {
  width: 220px;
}

/**
当菜单被折叠时候，菜单的dom元素会加上el-menu--collapse的类
通过把这个类下的对应层级里面的标题文字和对应小箭头隐藏起来
之所以折叠时文字图标不隐藏的原因，见这篇文章：
    https://blog.csdn.net/qq_40580023/article/details/103778414
    即：./components/myitem文件中的div导致的
**/
/deep/ .el-menu--collapse .el-submenu .el-submenu__title span {
  display: none;
}
/deep/
  .el-menu--collapse
  .el-submenu
  .el-submenu__title
  .el-submenu__icon-arrow {
  display: none;
}

// 解决1像素的问题，注释掉看效果
.el-menu {
  // border-right: solid 1px #e6e6e6;
  border-right: none;
}
</style>
