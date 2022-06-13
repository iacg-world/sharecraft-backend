import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const jwt = app.middleware.jwt({
    secret: app.config.jwt.secret,
  })
  const logger = app.middleware.myLogger(
    {
      allowedMethod: ['GET'],
    },
    app,
  )
  router.get('/', controller.home.index)
  router.get('/dog', logger, controller.home.getDog)
  router.post('/api/users/create', controller.user.createByEmail)
  router.get('/api/users/getUserInfo', app.jwt as any, controller.user.show)
  router.post('/api/users/loginByEmail', controller.user.loginByEmail)
  router.post('/api/users/genVeriCode', controller.user.sendVeriCode)
  router.post('/api/users/loginByPhoneNumber', controller.user.loginByCellphone)
}
