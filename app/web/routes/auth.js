import Router from 'koa-router'
import jwt from 'koa-jwt'
import Controller from '../controllers/auth'
import passport from '../../lib/passport'



const router = new Router({prefix: '/auth'})


router.post('/login', Controller.login)
router.post('/register', Controller.register)
router.get('/verifyemail/:token', Controller.verifyEmail)

router.get('/login-facebook', passport.authenticate('facebook', {
    scope: [
      'public_profile',
      'email',
    ],
}));

router.get('/facebook-callback', passport.authenticate('facebook', {}), Controller.facebook_callback);


export default router
