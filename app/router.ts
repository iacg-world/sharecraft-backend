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
}
