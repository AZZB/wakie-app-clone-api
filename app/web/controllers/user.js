import Lib from '../../lib'
import Storage from '../../lib/storage'
import Accounts from '../../contexts/accounts'
import Feeds from '../../contexts/feeds'
import UserView from '../views/user'
import TopicView from '../views/topic'



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
    const topics = await Feeds.get_user_topics(id)
    TopicView.render(ctx, topics)
  } catch (e) {
    LOG('UserController:topics exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function faves(ctx, next) {
  const id = ctx.params.id
  try {
    const faves = await Accounts.get_user_faves(id)
    UserView.render_faves(ctx, faves)
  } catch (e) {
    LOG('UserController:faves exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function faved(ctx, next) {
  const id = ctx.params.id
  try {
    const faved = await Accounts.get_user_faved(id)
    UserView.render_faved(ctx, faved)
  } catch (e) {
    LOG('UserController:faved exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function add_fave(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const { to_fave } = ctx.request.body
  try {
    const result = await Accounts.add_fave(logged_user_id, to_fave)
    UserView.render_dumb(ctx, result)
  } catch (e) {
    LOG('UserController:add_fave exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function remove_fave(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const to_remove = ctx.params.to_remove
  try {
    await Accounts.remove_fave(logged_user_id, to_remove)
    ctx.status = 204
  } catch (e) {
    LOG('UserController:remove_fave exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}


async function upload_photo(ctx, next) {
  const logged_user_id = ctx.state.user.id
  try {
    const user = await Accounts.get_user(logged_user_id)
    await Storage.upload(ctx, next)
    user.profile.photo = ctx.req.file.filename
    await user.save()
    UserView.render_dumb(ctx, { success: true })
  } catch (e) {
    LOG('UserController-upload_photo', e)
    Lib.error_handler(ctx, e, next)
  }
}

async function display_photo(ctx, next) {
  const logged_user_id = ctx.state.user.id
  try {
    const user = await Accounts.get_user(logged_user_id)
    const { type, stream } = await Storage.stream_image(ctx.context.upload_folder_path, user.profile.photo)
    ctx.type = type
    ctx.body = stream
  } catch (e) {
    LOG('UserController-display_photo', e)
    Lib.error_handler(ctx, e, next)
  }
}

export default {
  show,
  update,
  topics,
  faves,
  faved,
  add_fave,
  remove_fave,
  upload_photo,
  display_photo,
}
