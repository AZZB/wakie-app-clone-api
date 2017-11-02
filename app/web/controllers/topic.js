import Lib from '../../lib'
import Feeds from '../../contexts/feeds'
import TopicView from '../views/topic'


async function index(ctx, next) {
  const logged_user_id = ctx.state.user.id
  try {
    const topics = await Feeds.get_topics(logged_user_id)
    TopicView.render(ctx, topics)
  } catch (e) {
    LOG('TopicController:index exception', e)
    await Lib.error_handler(ctx, e, next)
  }
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
}

async function like_topic(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    const result = await Feeds.like_topic(id, logged_user_id)
    TopicView.render_dumb(ctx, result)
  } catch (e) {
    LOG('TopicController:like_topic exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function comment_index(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const topic_id = ctx.params.id
  try {
    const comments = await Feeds.get_comments(topic_id, logged_user_id)
    TopicView.render_comment(ctx, comments)
  } catch (e) {
    LOG('TopicController:comment_index exception', e)
    await Lib.error_handler(ctx, e, next)
  }
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
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    await Feeds.remove_comment(id, logged_user_id)
    ctx.status = 204
  } catch (e) {
    LOG('TopicController:comment_remove exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}

async function like_comment(ctx, next) {
  const logged_user_id = ctx.state.user.id
  const id = ctx.params.id
  try {
    const result = await Feeds.like_comment(id, logged_user_id)
    TopicView.render_dumb(ctx, result)
  } catch (e) {
    LOG('TopicController:like_comment exception', e)
    await Lib.error_handler(ctx, e, next)
  }
}


export default {
  index,
  show,
  create,
  remove,
  like_topic,

  comment_index,
  comment_create,
  comment_remove,
  like_comment,
}
