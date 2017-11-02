import Lib from '../../lib'
import Feeds from '../../contexts/feeds'
import TopicView from '../views/topic'


async function index(ctx, next) {
  ctx.body = 'index'
}

async function show(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    const topic = await Feeds.get_topic(id, logged_user_id)
    TopicView.render(ctx, topic)
  } catch (e) {
    LOG('TopicController:show exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function create(ctx, next) {
  const body = {...ctx.request.body, user_id: ctx.state.user.id}
  try {
    const topic = await Feeds.create_topic(body)
    TopicView.render(ctx, topic)
  } catch (e) {
    LOG('TopicController:create exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function remove(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    await Feeds.remove_topic(id, logged_user_id)
    ctx.status = 204
  } catch (e) {
    LOG('TopicController:remove exception', e)
    await Lib.error_handler(ctx, e, next)
  }
  ctx.body = 'remove'
}

async function comment_index(ctx, next) {
  try {

  } catch (e) {
    LOG('TopicController:comment_index exception', e)
    await Lib.error_handler(ctx, e, next)
  }
  ctx.body = 'comment_index'
}

async function comment_create(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  const body = {...ctx.request.body, user_id: logged_user_id, topic_id: id}
  try {
    const comment = await Feeds.create_comment(body)
    TopicView.render_comment(ctx, comment)
  } catch (e) {
    LOG('TopicController:comment_create exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function comment_remove(ctx, next) {
  ctx.body = 'comment_remove'
}


export default {
  index,
  show,
  create,
  remove,

  comment_index,
  comment_create,
  comment_remove
}
