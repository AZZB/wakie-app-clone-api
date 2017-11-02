import Router from 'koa-router'
import Controller from '../../controllers/topic'

const router = new Router({
  prefix: '/topics',
})



router.get('/:id/comments', Controller.comment_index)
router.post('/:id/comments', Controller.comment_create)
router.del('/comments/:id', Controller.comment_remove)
router.post('/comments/:id/like', Controller.like_comment)

router.get('/', Controller.index)
router.get('/:id', Controller.show)
router.post('/', Controller.create)
router.del('/:id', Controller.remove)
router.post('/:id/like', Controller.like_topic)





export default router
