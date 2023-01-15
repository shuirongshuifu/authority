import Vue from 'vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter)
import store from '@/store'
import Layout from '@/layout'

// 固定的静态路由，比如登录页、首页、404页等...
const staticRoutes = [
  {
    path: '/',
    // component: resolve => require(["@/layout/index.vue"], resolve),
    component: Layout, // 二者一个意思
    redirect: '/home',
    children: [
      {
        path: "/home",
        name: "home",
        component: resolve => require(["@/views/home.vue"], resolve),
      },
    ]
  },
  {
    path: '/login',
    component: resolve => require(["@/views/login.vue"], resolve),
  },
  {
    path: '/404',
    component: resolve => require(["@/views/404.vue"], resolve),
  },
  // { path: '*', redirect: '/404' } // 404页面在最后，但是不能在这里，在这里就会刷新自动到404页面了
]

// 接口返回来的动态路由树（根据menuTree加工而来的）
// store.state.menu.routerTree


// 初始情况下使用静态路由，登录成功以后获取后端返回的菜单信息，通过addRoutes添加动态路由
const createRouter = () => {
  return new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: staticRoutes
  });
}

const router = createRouter();


// 重写路由push方法，兜错
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject);
  return routerPush.call(this, location).catch(error => error)
};

// 路由全局拦截
router.beforeEach((to, from, next) => {
  // 去登录页面肯定放行的，管他有没有token
  if (to.path === '/login') {
    next()
  }
  // 去的不是登录页面，再看看有没有token认证
  else {
    const token = sessionStorage.getItem('token')
    if (!token) { // 没token，就让其回到登录页登录
      next({ path: "/login" })
    } else { // 有token，再看看有没有菜单路由信息
      if (store.state.menu.routerTree.length > 0) { // 有菜单信息，就放行
        next()
      } else { // 没有菜单信息，就再发一次请求获取菜单信息
        let menuIds = sessionStorage.getItem('menuIds')
        store.dispatch('menu/tree_menu', menuIds).then((res) => {
          if (res.code == 0) {
            router.addRoutes(store.state.menu.routerTree)
            next({ ...to, replace: true }) // 确保动态路由已被完全添加进去了
          }
        })
      }
    }
  }
})

export default router
