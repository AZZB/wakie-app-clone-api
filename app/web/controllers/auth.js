import jwt from 'jsonwebtoken'
import Lib from '../../lib'
import Accounts from '../../contexts/accounts'
import AuthView from '../views/auth'
import { SECRET_JWT, jwtConfig, email_jwt_config } from '../configs'
import sendEmailVerificationLink from '../mailer'


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

    process.nextTick(() => {
        const token = jwt.sign(AuthView.auth_user(user), SECRET_JWT, email_jwt_config)
        sendEmailVerificationLink(user, token);
    });

    const token = jwt.sign(AuthView.auth_user(user), SECRET_JWT, jwtConfig)
    AuthView.render(ctx, user, token)
  } catch (e) {
    LOG('AuthController:register exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function verifyEmail(ctx, next) {
  const token = ctx.params.token
  try {
    let user = await new Promise((resolve, reject) => {
                  jwt.verify(token, SECRET_JWT, (err, user) => {
                    resolve(user)
                  })
                });

    user = await Accounts.confirm_user(user.id)
    AuthView.render_email_verification_success(ctx, user)
  } catch (e) {
    LOG('AuthController:verifyEmail exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}


async function facebook_callback(ctx, next) {
  let user_data = ctx.req.user
  try {
    const user = await Accounts.create_user_by_facebook(user_data, ctx.context.upload_folder_path)
    const token = jwt.sign(AuthView.auth_user(user), SECRET_JWT, jwtConfig)
    AuthView.render(ctx, user, token)
  } catch (e) {
    LOG('AuthController:facebook_callback exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}



export default {
  login,
  register,
  verifyEmail,
  facebook_callback,
}
