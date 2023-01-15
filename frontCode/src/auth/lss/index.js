// 导入http中创建的axios实例
import http from '../api';

/**
 * 菜单树相关接口
 * */
export const getAllMenu = (searchWord) => http("get", `/auth/allMenu?searchWord=${searchWord}`)//分页查询树结构的所有数据
export const addMenu = (params) => http("post", `/auth/addMenu`, params)//新增一条
export const deleteMenu = (id) => http("get", `/auth/deleteMenu?id=${id}`)//删除一条
export const queryMenuById = (id) => http("get", `/auth/queryMenuById?id=${id}`)//根据id查单条
export const editMenu = (params) => http("post", `/auth/editMenu`, params)//编辑一条

/**
 * 角色相关接口
 * */
export const addRole = (params) => http("post", `/auth/addRole`, params)//新增一条
export const listRoles = (searchWord = '') => http("get", `/auth/listRoles?searchWord=${searchWord}`)//查询所有的角色(也是登录时下拉框选项)
export const deleteRole = (roleId) => http("get", `/auth/deleteRole?roleId=${roleId}`)//删除一条
export const editRole = (params) => http("post", `/auth/editRole`, params)//编辑一条

/**
 * 登录相关接口
 * */ 
export const roleMenuByMenuId = (menuIds) => http("get", `/auth/roleMenuByMenuId?menuIds=${menuIds}`) // 登录时根据角色roleId查询能看到哪些菜单





























export const getTableData = (params) => http("get", `/auth/getTableData`, params)//分页查询获取人物信息，带有搜索
export const getTotalCount = (params) => http("get", `/auth/getTotalCount`, params)//分页查询获取人物信息总条目数，带有搜索
export const deleteData = (params) => http("get", `/auth/deleteData`, params)//删除人物信息
export const selectDelete = (params) => http("get", `/auth/selectDelete`, params)//勾选批量删除
export const addData = (params) => http("post", `/auth/addData`, params)//新增人物信息
export const editData = (params) => http("post", `/auth/editData`, params)//编辑人物信息
export const downExcelTemp = (params) => http("get", `/auth/downExcelTemp`, params, 'application/json; charset=UTF-8', "arraybuffer")//下载excel模板
export const exportExcel = (params) => http("post", `/auth/exportExcel`, params, 'application/json; charset=UTF-8', "arraybuffer")//导出表格数据
// export const uploadExcel = (params) => http("post", `/auth/uploadExcel`,params,'application/json; charset=UTF-8',"arraybuffer")//上传excel表格

export const findMusicUrl = (params) => http("get", `/auth/findMusicUrl`, params)//获取后台的音乐信息

export const addArticle = (params) => http("post", `/auth/addArticle`, params)//新增文章
export const getArticle = (params) => http("get", `/auth/getArticle`, params)//查询文章






