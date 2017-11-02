import Router from 'koa-router'
import Controller from '../../controllers/topic'

const router = new Router({
  prefix: '/topics',
})



router.get('/:id/comments', Controller.comment_index)
router.post('/:id/comments', Controller.comment_create)
router.del('/:id/comments/:id', Controller.comment_remove)

router.get('/', Controller.index)
router.get('/:id', Controller.show)
router.post('/', Controller.create)
router.del('/:id', Controller.remove)





export default router
