import Router from 'koa-router'



const router = new Router({
  prefix: '/admin'
})


router.get('/', async (ctx, next) => {
  ctx.body = 'Admin route'
})



export default router
