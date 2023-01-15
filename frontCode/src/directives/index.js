// 引入各个自定义指令
import btn from "./btn";
import load from "./load";

// 自定义指令对象，用于遍历注册
const directives = {
    btn,
    load
}

// 批量注册指令并暴露到main.js中去便于注册
export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key])
        })
    }
}