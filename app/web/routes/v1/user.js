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
router.post('/add_fave', Controller.add_fave)
router.del('/remove_fave/:to_remove', Controller.remove_fave)


export default router
