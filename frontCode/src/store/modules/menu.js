import { roleMenuByMenuId } from "@/auth/lss/index.js"; // 相当于根据菜单id获取的登录接口
import { setElMenuTreeWithoutBtn, setRouterTree, setBtnAuth } from "@/utils/index.js";
import router from "@/router";

const state = {
    isCollapse: false,
    menuTree: [], // el-menu需要的菜单树
    routerTree: [] // vue-router需要的路由树
};

const mutations = {
    FOLD_MENU(state) {
        state.isCollapse = !state.isCollapse
    },
    TREE_MENU(state, menuTree) {
        state.menuTree = menuTree
    },
    ROUTE_TREE(state, routerTree) {
        state.routerTree = routerTree
    },
    CLEAR_STATE() {
        state.menuTree = []
        state.routerTree = []
    }
}

const actions = {
    fold_menu({ commit }) {
        commit('FOLD_MENU')
    },
    // 相当于login登录接口
    tree_menu({ commit, dispatch }, menuIds) {
        return new Promise((resolve, reject) => {
            roleMenuByMenuId(menuIds).then(
                (res) => {
                    let menuTree = res.data[0].children // 顶级节点PC不要
                    commit('TREE_MENU', setElMenuTreeWithoutBtn(menuTree, []))
                    commit('ROUTE_TREE', setRouterTree(menuTree, []))
                    sessionStorage.setItem("token", "token"); // 模拟token存储
                    sessionStorage.setItem("menuIds", menuIds); // 存一份当前角色的menuIds
                    sessionStorage.setItem("menuTree", JSON.stringify(menuTree)); // 存一份菜单树（可不存）
                    setBtnAuth(menuTree) // 设置按钮
                    resolve(res) // 抛出去告知结果
                }
            ).catch(
                (err) => {
                    reject(err);
                }
            )
        })
    },
    // 登出退出接口
    login_out({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 清空相关数据，跳出去
                sessionStorage.clear()
                commit('CLEAR_STATE')
                router.replace({ path: "/login" })
                resolve('退出成功') // 抛出去告知结果
            }, 100)
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
};