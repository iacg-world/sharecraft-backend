#!/bin/bash

# shell脚本中发生错误，即命令返回值不等于0，则停止执行并退出shell
set -e

mongo <<EOF
use admin
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use craft
db.createUser({
  user:  '$MONGO_DB_USERNAME',
  pwd: '$MONGO_DB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'craft'
  }]
})
db.createCollection('works')
db.works.insertMany([
{
  "_id": "6461b407afbce40030fdcfee",
  "copiedCount": 0,
  "status": 2,
  "channels": [
    {
      "name": "默认",
      "id": "2rLN8W"
    },
    {
      "name": "test",
      "id": "T1uUxj"
    }
  ],
  "title": "test title",
  "desc": "未命名作品",
  "coverImg": "http://sharecraft-backend.oss-cn-shanghai.aliyuncs.com/sharecraft-test/mnyQ7Q.png",
  "user": "64619b35afbce40030fdcf62",
  "author": "1033581609@qq.com",
  "uuid": "mvMvdD",
  "createdAt": "2023-05-15T04:24:39.070Z",
  "updatedAt": "2023-05-15T08:04:22.119Z",
  "id": 1,
  "__v": 0,
  "content": {
    "components": [
      {
        "id": "a3e7342a-76aa-43e2-9eaa-2cd901616f98",
        "name": "c-text",
        "layerName": "图层1",
        "props": {
          "text": "hello",
          "fontSize": "20px",
          "fontFamily": "",
          "fontWeight": "normal",
          "fontStyle": "normal",
          "textDecoration": "none",
          "lineHeight": "1",
          "textAlign": "left",
          "color": "red",
          "backgroundColor": "#efefef",
          "actionType": "",
          "url": "",
          "height": "100px",
          "width": "100px",
          "paddingLeft": "0px",
          "paddingRight": "0px",
          "paddingTop": "0px",
          "paddingBottom": "0px",
          "borderStyle": "none",
          "borderColor": "#000",
          "borderWidth": "0",
          "borderRadius": "0",
          "boxShadow": "0 0 0 #000000",
          "opacity": "1",
          "position": "absolute",
          "left": "100px",
          "top": "150px",
          "right": "0"
        }
      },
      {
        "name": "c-text",
        "id": "2ad808a4-88da-4704-951e-6921c4be188a",
        "props": {
          "text": "正文内容",
          "fontSize": "14px",
          "fontFamily": "",
          "fontWeight": "normal",
          "fontStyle": "normal",
          "textDecoration": "none",
          "lineHeight": "1",
          "textAlign": "left",
          "color": "#000000",
          "backgroundColor": "",
          "actionType": "",
          "url": "",
          "height": "",
          "width": "100px",
          "paddingLeft": "0px",
          "paddingRight": "0px",
          "paddingTop": "0px",
          "paddingBottom": "0px",
          "borderStyle": "none",
          "borderColor": "#000",
          "borderWidth": "0",
          "borderRadius": "0",
          "boxShadow": "0 0 0 #000000",
          "opacity": "1",
          "position": "absolute",
          "left": "71.70001220703125px",
          "top": "59.80000305175781px",
          "right": "0",
          "tag": "p"
        },
        "layerName": "图层2"
      }
    ],
    "props": {
      "backgroundColor": "#ffffff",
      "backgroundImage": "",
      "backgroundRepeat": "no-repeat",
      "backgroundSize": "cover",
      "height": "560px"
    }
  },
  "latestPublishAt": "2023-05-15T08:04:22.119Z",
  "isTemplate": true
}
])
EOF