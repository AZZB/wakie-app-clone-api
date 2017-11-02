import Router from 'koa-router'
import Controller from '../../controllers/user'

const router = new Router({
  prefix: '/users',
})



router.get('/:id', Controller.show)
router.put('/', Controller.update)
router.get('/:id/topics', Controller.topics)
router.get('/:id/faves', Controller.faves)
router.get('/:id/faved', Controller.faved)


export default router
