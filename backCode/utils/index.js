let arr = [
    {
        "id": 1,
        "pid": 0,
        "name": "PC",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "菜单树顶层",
        "isDelete": null
    },
    {
        "id": 2,
        "pid": 1,
        "name": "Vue",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "Vue一级子菜单部分",
        "isDelete": null
    },
    {
        "id": 3,
        "pid": 1,
        "name": "React",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "React一级子菜单部分",
        "isDelete": null
    },
    {
        "id": 4,
        "pid": 1,
        "name": "Angular",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "Angular一级子菜单部分",
        "isDelete": null
    },
    {
        "id": 5,
        "pid": 2,
        "name": "Vuex",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "Vuex节点",
        "isDelete": null
    },
    {
        "id": 6,
        "pid": 2,
        "name": "VueRouter",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "VueRouter节点",
        "isDelete": null
    },
    {
        "id": 7,
        "pid": 3,
        "name": "ReactDom",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "ReactDom节点",
        "isDelete": null
    },
    {
        "id": 8,
        "pid": 3,
        "name": "ReactRender",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "ReactRender节点",
        "isDelete": null
    },
    {
        "id": 9,
        "pid": 4,
        "name": "AngularBasic",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "AngularBasic节点",
        "isDelete": null
    },
    {
        "id": 10,
        "pid": 4,
        "name": "AngularNormal",
        "url": null,
        "componentUrl": null,
        "type": 1,
        "icon": null,
        "sort": null,
        "remark": "AngularNormal节点",
        "isDelete": null
    }
]

/**
 * 想要将扁平化数组转成树结构，首先必须知道顶级的pid是啥（0）
 * 第一步，假设我们只需要找顶级的这一项，
 * 只需要对比一下那一项的pid是这个pid即可
 * */
// 通过pid将扁平化的数组转成树结构。给树结构添加level字段（数据库中没存，当然存也可以）
module.exports = function changeTree(arr, pid, level) {
    let treeArr = []
    level = level + 1
    arr.forEach((item, index) => {
        if (item.pid == pid) {
            // 把不是这一项的剩余几项，都丢到这个children数组里面，再进行递归（这一项已经确定了，是父级，没必要再递归了）
            let restArr = arr.filter((item, index) => { return item.pid != pid })
            item['children'] = changeTree(restArr, item.id, level) // 这里需要进行传id当做pid（因为自己的id就是子节点的pid）
            if (item.children.length == 0) { delete item.children } // 加一个判断，若是children: [] 即没有内容就删除，不返回给前端children字段
            item['level'] = level // 添加层级字段
            // 操作完以后，把一整个的都追加到数组中去
            treeArr.push(item)
        }
    });
    return treeArr
}