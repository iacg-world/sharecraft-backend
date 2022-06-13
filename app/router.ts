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
  router.get('/api/users/getUserInfo', jwt, controller.user.show)
  router.post('/api/users/loginByEmail', controller.user.loginByEmail)
}
