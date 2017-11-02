import Topic, { cast as topic_cast } from './Topic'
import Comment, { cast as comment_cast } from './Comment'
import Accounts from '../accounts'
import Lib from '../../lib'

const check_attrs = Lib.Tools.check_attrs


/**
  this function gonna return list of topics based on user activity ( faves, tags and so on )
*/
async function get_topics(logged_user_id) {
  const topics = await Topic.find({}).populate('user_creator', 'profile')

  return topics.map(topic => {
                  topic.other_fields = { logged_user_id }
                  return topic
                })
}

async function get_topic(id, logged_user_id) {
  const topic = await Topic.findById(id).populate('user_creator', 'profile')
  if(!topic || topic.deleted_at) throw new CustomError('TopicError', 'Topic not found')

  topic.other_fields = { logged_user_id }

  return topic
}

async function get_user_topics(user_id) {
  const topics = await Topic.find({user_creator: user_id}).populate('user_creator', 'profile')
  return topics
}

async function create_topic(attrs) {
  check_attrs(attrs, 'topic user_id')
  const {topic: topic_data, user_id} = attrs
  let topic = await Topic.create({...topic_cast(topic_data), user_creator: user_id})
  return await get_topic(topic._id, user_id)
}

async function remove_topic(id, user_id) {
  const topic = await Topic.findOne({ _id: id, user_creator: user_id })
  if(!topic) return;
  await Topic.update(topic, {deleted_at: Date.now()})
}

async function get_comments(topic_id, logged_user_id) {
  const comments = (await Topic.findById(topic_id, 'comments').populate({path: 'comments', populate: {path: 'user_creator', select: 'profile'}})).comments

  return comments.map(comment => {
                  comment.other_fields = { logged_user_id }
                  return comment
                })
}

async function get_comment(id, logged_user_id) {
  const comment = await Comment.findById(id).populate('user_creator', 'profile')
  if(!comment || comment.deleted_at) throw new CustomError('CommentError', 'Comment not found')

  comment.other_fields = { logged_user_id }

  return comment
}

async function create_comment(attrs) {
  check_attrs(attrs, 'comment user_id topic_id')
  const {comment: comment_data, user_id, topic_id} = attrs
  const topic = await get_topic(topic_id, user_id)
  const comment = await Comment.create({...comment_cast(comment_data), user_creator: user_id})
  topic.comments.push(comment)
  await topic.save()
  return await get_comment(comment._id, user_id)
}

async function remove_comment(comment) {
  await Comment.update(comment, {deleted_at: Date.now()})
}


async function clean() {
  await Comment.remove({})
  await Topic.remove({})
  await Accounts.clean()
}


export default {
  get_topics,
  get_topic,
  get_user_topics,
  create_topic,
  remove_topic,

  get_comments,
  get_comment,
  create_comment,
  remove_comment,

  clean,
}
