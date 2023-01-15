import { getBtnAuth } from "@/utils";
export default {
    inserted(el, binding, vnode) {
        const whichPage = Object.keys(binding.value)[0]
        const btnName = Object.values(binding.value)[0]
        let flag = getBtnAuth(whichPage, btnName)
        if (!flag) {
            el.parentNode.removeChild(el)
        }
    },
    unbind(el, binding, vnode) {
    }
}