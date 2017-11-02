import Router from 'koa-router'
import jwt from 'koa-jwt'
import authRouter from './auth'
import api_v1_router from './v1'
import adminRouter from './admin'

const router = new Router()


router.get('/', async (ctx, next) => {
  ctx.body = ' ----------- Wakie clone API --------------'
})


router.use(adminRouter.routes())
router.use(authRouter.routes())
router.use(api_v1_router.routes())


export default router
