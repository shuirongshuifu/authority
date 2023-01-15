const express = require('express')
const route = express.Router()
const pool = require('./sql/index')
const changeTree = require('./utils/index') // 将扁平化数组转成树结构

/* 角色部分 */
// 新增角色信息
route.post("/addRole", (req, res) => {
  // post请求，新增的参数在请求体中req.body

  // INSERT INTO myTale(NAME,sex,borndate) VALUES('白骨精','女','2021-05-16');
  let str = ""
  Object.values(req.body).forEach((item) => {
    str = str + "\'" + item + "\'" + ","
  })
  let editStr = str.substr(0, str.length - 1)

  let sql = `INSERT INTO roles (${Object.keys(req.body).toString()}) VALUES(${editStr})`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      if (results.affectedRows == 1) {
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，新增成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 1,
          msg: "失败",
          data: "抱歉新增失败"
        }
        res.send(apiRes)
      }
    })
  })
})

// 角色列表查询
route.get('/listRoles', (req, res) => {
  let sql = `SELECT * FROM roles WHERE (roleName LIKE '%${req.query.searchWord}%' OR roleRemark LIKE '%${req.query.searchWord}%')`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      console.log('results', results)
      connection.release()
      let apiRes = {
        code: 0,
        msg: "成功",
        data: results
      }
      res.send(apiRes)
    })
  })
})

// 根据roleId删除角色（物理删除）
route.get("/deleteRole", (req, res) => {
  let sql = `DELETE from roles WHERE roleId = ${req.query.roleId}`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      if (results.affectedRows == 1) { // 说明影响了一行，即 删掉了一行
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，删除成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "很抱歉，删除失败了..."
        }
        res.send(apiRes)
      }
    })
  })
})

// 编辑角色信息（这里就不用queryRoleById了，因为前端可以直接取用页面上的数据使用）
route.post("/editRole", (req, res) => {
  let roleId = req.body.roleId
  delete req.body.roleId

  let keysArr = Object.keys(req.body)
  let valuesArr = Object.values(req.body)

  let str = ""
  for (let i = 0; i < keysArr.length; i++) {
    for (let j = 0; j < valuesArr.length; j++) {
      if (i == j) {
        str = `${str},${keysArr[i]}=${"\'" + valuesArr[i] + "\'"}`
      }
    }
  }
  str = str.substr(1, str.length)

  let sql = `UPDATE roles SET ${str} WHERE roleId=${roleId}`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      if (results.affectedRows == 1) {
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，编辑成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 0,
          msg: "失败",
          data: "抱歉编辑失败了！"
        }
        res.send(apiRes)
      }
    })
  })
})


// 根据角色id查询能看到的菜单有哪些（前提是这些菜单是启用状态的）
route.get('/roleMenuByMenuId', (req, res) => {
  let menuIds = req.query.menuIds
  /* sql方式一：nodejs中[1,2,3]自动转成1,2,3 */
  let sql = `SELECT * FROM menus WHERE id IN (${menuIds}) AND isDel = 1 AND status = 1`

  /* sql方式二：SELECT * FROM `menus` WHERE id IN (1,2,3)的查询结果和 id IN ("1","2","3")是一样的 */
  // let str = ""
  // menuIds.split(',').forEach((item)=>{
  //   str = str + "\'" + item + "\'" + ","
  // })
  // str = str.substr(0, str.length - 1)
  // let sql = `SELECT * FROM menus WHERE id IN (${ str })`

  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      console.log('results', results);
      connection.release()
      let apiRes = {
        code: 0,
        msg: "成功",
        data: changeTree(results, 0, 0) // 有查询条件的，平铺表格，没查询条件的为树表格
      }
      res.send(apiRes)
    })
  })
})






/* 菜单部分接口 */
// 查询所有的树菜单结构数据且排序（未删除状态）
route.get('/allMenu', (req, res) => {
  let sql = `SELECT * FROM menus WHERE (name LIKE '%${req.query.searchWord}%' OR url LIKE '%${req.query.searchWord}%') AND isDel = 1 ORDER BY sort`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      console.log('results', results)
      connection.release()
      let apiRes = {
        code: 0,
        msg: "成功",
        data: req.query.searchWord ? results : changeTree(results, 0, 0) // 有查询条件的，平铺表格，没查询条件的为树表格
      }
      res.send(apiRes)
    })
  })
})

// 新增一条树数据
route.post("/addMenu", (req, res) => {
  // post请求，新增的参数在请求体中req.body

  // INSERT INTO myTale(NAME,sex,borndate) VALUES('白骨精','女','2021-05-16');
  let str = ""
  Object.values(req.body).forEach((item) => {
    str = str + "\'" + item + "\'" + ","
  })
  let editStr = str.substr(0, str.length - 1)

  let sql = `INSERT INTO menus (${Object.keys(req.body).toString()}) VALUES(${editStr})`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      console.log('新增数据库结果--->', results.affectedRows);
      if (results.affectedRows == 1) {
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，新增成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 1,
          msg: "失败",
          data: "抱歉新增失败"
        }
        res.send(apiRes)
      }
    })
  })
})

/**
 * 若要删除某个菜单，后端首先要sql查询，判断这个菜单有没有相关角色在使用
 * 若有相关角色在使用，则提示将相关的角色取消赋予这个菜单的权限，没有角色在使用
 * 这个菜单了，再去删除。（切记不能直接删）
 * 删除角色也同理，看看这个角色有没有用户在使用，确保这个角色没有用户在使用即可删除
 * */
// 删除一条树数据（逻辑删除）
route.get("/deleteMenu", (req, res) => {
  /* 示例demo中不能删除，只允许开启或关闭改变状态 */
  res.send({ code: 1, msg: '失败', data: "不能删除" })
  return
  // if (req.query.id == 1) {
  //   res.send({ code: 1, msg: '失败', data: "根节点PC不允许删除" })
  //   return
  // }
  let sql = `UPDATE menus SET isDel = 2 WHERE id = ${req.query.id}`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      if (results.affectedRows == 1) { // 说明影响了一行，即 删掉了一行
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，删除成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 1,
          msg: "失败",
          data: "很抱歉，删除失败了..."
        }
        res.send(apiRes)
      }
    })
  })
})

// 根据id查询单条数据，不用查children节点数据
route.get('/queryMenuById', (req, res) => {
  let sql = `SELECT * FROM menus WHERE id = ${req.query.id}`
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      let apiRes = {
        code: 0,
        msg: "成功",
        data: results[0]
      }
      res.send(apiRes)
    })
  })
})

// 编辑一条树数据
route.post("/editMenu", (req, res) => {
  let id = req.body.id
  if (id == 1) {
    res.send({ code: 1, msg: '失败', data: "根节点不允许编辑" })
    return
  }
  delete req.body.id

  let keysArr = Object.keys(req.body)
  let valuesArr = Object.values(req.body)

  let str = ""
  for (let i = 0; i < keysArr.length; i++) {
    for (let j = 0; j < valuesArr.length; j++) {
      if (i == j) {
        str = `${str},${keysArr[i]}=${"\'" + valuesArr[i] + "\'"}`
      }
    }
  }
  str = str.substr(1, str.length)

  let sql = `UPDATE menus SET ${str} WHERE id=${id}`
  console.log('sql', sql);
  pool.getConnection(function (err, connection) {
    if (err) { throw err }
    connection.query(sql, function (error, results, fields) {
      connection.release()
      if (results.affectedRows == 1) {
        let apiRes = {
          code: 0,
          msg: "成功",
          data: "恭喜您，编辑成功啦..."
        }
        res.send(apiRes)
      } else {
        let apiRes = {
          code: 0,
          msg: "失败",
          data: "抱歉编辑失败了！"
        }
        res.send(apiRes)
      }
    })
  })
})

module.exports = route // 暴露出去方便管理
