/**
 * 菜单按钮树结构有一个前提，就是按钮一定是最里层的，不能在按钮内部再添加菜单
 * 且按钮同级不能有菜单，按钮同级只能是按钮
 * */ 

// 加工后端返的树结构数据 是给菜单递归组件el-menu使用的
export function setElMenuTreeWithoutBtn(oldTree, newTree) {
    oldTree.forEach((item) => {
        let newTreeObj = {
            ...item,
            children: null
        }
        if (item.children) { // 有子集内容，且子集内容为菜单type=1才去递归（按钮type=2就不要了）
            if (item.children[0].type == 1) {
                setElMenuTreeWithoutBtn(item.children, newTreeObj.children = [])
            }
        }
        if (newTreeObj.children == null) { // 为null说明没有子集，或者子集都是按钮被忽略了，删除之
            delete newTreeObj.children
        }
        newTree.push(newTreeObj)
    })
    return newTree
}

// 加工后端返的树结构数据 是给vue-router路由表使用
import Layout from '@/layout/index.vue'
let page404 = { path: '*', redirect: '/404' }
export function setRouterTree(oldTree, newTree) {
    oldTree.forEach((item) => {
        let newTreeObj = {
            path: item.level == 2 ? `/${item.url}` : `${item.url}`,
            name: item.name,
            component(resolve) { require([`@/views${item.cUrl}`], resolve) },
            meta: {
                title: item.name
            }
        }
        if (item.level == 2) {
            // newTreeObj['component'] = Layout // 这两个一个意思
            newTreeObj['component'] = (resolve) => {
                require(["@/layout/index.vue"], resolve)
            }
        }
        if (item.children) {
            if (item.children[0].type == 1) { // 路由表树结构也不需要按钮哦，只要type等于1的菜单
                setRouterTree(item.children, newTreeObj.children = [])
            }
        }
        newTree.push(newTreeObj)
    });
    // return newTree 
    return newTree.concat(page404) // 将404页面拼接到最后面，做通配路由使用
}


// 按钮权限设置
export function setBtnAuth(tree, btnAuthObj = {}) {
    // 循环加工
    tree.forEach((item) => {
        if (item.type == 1) { // 类型为1说明是菜单
            btnAuthObj[item.name] = {} // 菜单就加上一个对象属性
            if (item.children) { // 若有子集，就递归加对象属性
                // 因为对象是引用类型，所以直接赋值整个按钮权限对象就都有了
                setBtnAuth(item.children, btnAuthObj[item.name])
            }
        }
        if (item.type == 2) { // 类型为2说明是按钮
            btnAuthObj[item.name] = true // 按钮的赋值true表示有按钮权限
        }
    })
    // 加工完毕以后，丢出去以供使用
    sessionStorage.setItem('btnAuthObj', JSON.stringify(btnAuthObj))
    return btnAuthObj
}


// 按钮权限获取
export function getBtnAuth(whichPage, btnName) { // 查找：那个页面下的什么按钮名字是否有权限
    let flag // 找到了，才说明有权限
    function getBtn(whichPage, btnName, btnAuthObj = JSON.parse(sessionStorage.getItem('btnAuthObj'))) {
        for (const key in btnAuthObj) {
            if (key == whichPage) {
                flag = btnAuthObj[key][btnName]
            } else {
                getBtn(whichPage, btnName, btnAuthObj[key])
            }
        }
    }
    getBtn(whichPage, btnName) // 递归查找标识赋值
    return flag ? true : false // 找到了为true，没找到undefined，这里再判断一下，返回布尔值
}