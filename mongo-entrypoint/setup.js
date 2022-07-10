/* eslint-disable no-undef */
// 链接数据库
let db = connect('mongodb://admin:pass@localhost:27017/admin')
// 选择数据库到 lego
db = db.getSiblingDB('craft')
// 创建一个 lego 的管理员用户
db.createUser({
  user: 'user',
  pwd: 'pass',
  roles: [{ role: 'readWrite', db: 'craft' }],
})
// 添加一些测试数据
db.createCollection('works')
db.works.insertOne({
  id: 19,
  title: '1024 程序员日',
  desc: '1024 程序员日',
  author: '185****2625',
  coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
  copiedCount: 737,
  isHot: true,
  isTemplate: true,
  createdAt: '2020-11-26T09:27:19.000Z',
})
