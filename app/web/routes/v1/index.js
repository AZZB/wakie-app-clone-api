import Router from 'koa-router'
import jwt from 'koa-jwt'
import userRouter from './user'
import topicRouter from './topic'
import { SECRET_JWT } from '../../configs'

const router = new Router({
  prefix: '/api',
})

router.get('/', async (ctx, next) => {
  ctx.body = ' ----------- Wakie clone API V1 --------------'
})

router.use(
  jwt({secret: SECRET_JWT, debug: true, passthrough: false})
);

router.use(userRouter.routes())
router.use(topicRouter.routes())


export default router
