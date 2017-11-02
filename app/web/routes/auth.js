import Router from 'koa-router'
import jwt from 'koa-jwt'
import Controller from '../controllers/auth'


const router = new Router({prefix: '/auth'})


router.post('/login', Controller.login)
router.post('/register', Controller.register)


export default router
