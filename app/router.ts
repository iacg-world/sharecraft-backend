import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  const logger = app.middleware.myLogger(
    {
      allowedMethod: ['GET'],
    },
    app,
  )
  router.get('/', controller.home.index)
  router.get('/dog', logger, controller.home.getDog)
  router.prefix('/api')
  router.post('/users/create', controller.user.createByEmail)
  router.get('/users/getUserInfo', controller.user.show)
  router.post('/users/loginByEmail', controller.user.loginByEmail)
  router.post('/users/genVeriCode', controller.user.sendVeriCode)
  router.post('/users/loginByPhoneNumber', controller.user.loginByCellphone)
  router.get('/users/passport/gitee', controller.user.oauth)
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee)


  router.get('/templates', controller.work.templateList)
  router.get('/templates/:id', controller.work.template)

  router.post('/works', controller.work.createWork)
  router.post('/works/copy/:id', controller.work.copyWork)
  router.get('/works', controller.work.myList)
  router.get('/works/:id', controller.work.myWork)
  router.patch('/works/:id', controller.work.update)
  router.delete('/works/:id', controller.work.delete)
  router.post('/works/publish/:id', controller.work.publishWork)
  router.post('/works/publish-template/:id', controller.work.publishTemplate)

  router.post('/utils/uploadFile', controller.utils.uploadToOSS)
  router.post('/utils/testBusBoy', controller.utils.testBusBoy)
  router.post('/utils/upload-img', controller.utils.uploadMutipleFiles)
}
