import Lib from '../../lib'
import Accounts from '../../contexts/accounts'
import UserView from '../views/user'



async function show(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    const user = await Accounts.get_user(id, logged_user_id)
    UserView.render(ctx, user)
  } catch (e) {
    LOG('UserController:show exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function update(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const body = ctx.request.body
  try {
    const user = await Accounts.update_user(logged_user_id, body)
    UserView.render(ctx, user)
  } catch (e) {
    LOG('UserController:update exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function topics(ctx, next) {
  const id = ctx.params.id
  try {
    const topics = await Accounts.get_user_topics(id)
    UserView.render_topic(ctx, topics)
  } catch (e) {
    LOG('UserController:topics exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function faves(ctx, next) {
  const id = ctx.params.id
  try {
    const faves = await Accounts.get_user_faves(id)
    UserView.render_fave(faves)
  } catch (e) {
    LOG('UserController:faves exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function faved(ctx, next) {
  const id = ctx.params.id
  try {
    const faved = await Accounts.get_user_faved(id)
    UserView.render_fave(faved)
  } catch (e) {
    LOG('UserController:faved exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}


export default {
  show,
  update,
  topics,
  faves,
  faved,
}
