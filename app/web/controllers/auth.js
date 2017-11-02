import jwt from 'jsonwebtoken'
import Lib from '../../lib'
import Accounts from '../../contexts/accounts'
import AuthView from '../views/auth'
import { SECRET_JWT, jwtConfig } from '../configs'



async function login(ctx, next) {
  const { login, password } = ctx.request.body
  try {
    const user = await Accounts.authenticate_by_login_password(login, password)
    const token = jwt.sign(AuthView.auth_user(user), SECRET_JWT, jwtConfig)
    AuthView.render(ctx, user, token)
  } catch (e) {
    LOG('AuthController:login exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function register(ctx, next) {
  const body = ctx.request.body
  try {
    const user = await Accounts.create_user(body)
    // TODO: send verification link to the user's email user.credential.email
    const token = jwt.sign(AuthView.auth_user(user), SECRET_JWT, jwtConfig)
    AuthView.render(ctx, user, token)
  } catch (e) {
    LOG('AuthController:register exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}



export default {
  login,
  register,
}
