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
    id: 19,
    title: '萤火之森',
    desc: '萤火之森',
    author: '173****1960',
    coverImg: 'https://sharecraft-backend.oss-cn-shanghai.aliyuncs.com/sharecraft-test/20180421210121_KddAy.jpeg',
    copiedCount: 737,
    isHot: true,
    isTemplate: true,
    isPublic: true,
    createdAt: '2022-11-26T09:27:19.000Z',
    content: {
      components: [
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
      props: {
        "backgroundColor": "#ffffff",
        "backgroundImage": "",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "height": "560px"
      }
    },
  }
])
EOF