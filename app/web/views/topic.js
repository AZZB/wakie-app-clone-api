/*
  if the function start with render means it will render a response using ctx.body
  else it's just describe the format of data
*/

import Lib from '../../lib'


function render(ctx, data, status) {
  Lib.Tools.abstract_render(ctx, data, status)(topic, 'topic', 'topics')
}


/**
  this function gonna return topic in this shape :
  #id ->
  #content ->
  #tags -> [string] | list of tags
  #created_at ->
  #likes_count -> number of likes
  #comments_count -> number of comments
  #you_liked -> boolean | define if you are on like this topic
  #you_commented -> boolean | define if you commented on this topic
  #user_creator -> {
    #id ->
    #fullname ->
    #photo ->
  }
*/
function topic(topic) {
  const { _id, content, created_at, tags, user_creator, other_fields: { logged_user_id }} = topic

  return {
    id: _id,
    content, created_at, tags,
    likes_count: topic.liked_by.length,
    comments_count: topic.comments.length,
    you_liked: !!topic.liked_by.find(uid => uid === logged_user_id),
    you_commented: !!topic.comments.find(uid => uid === logged_user_id),
    user_creator: {
      id: user_creator._id,
      fullname: user_creator.profile.fullname,
      photo: user_creator.profile.photo,
    },
  };
}



function render_comment(ctx, data, status) {
  Lib.Tools.abstract_render(ctx, data, status)(comment, 'comment', 'comments')
}


/**
  this function gonna return comment in this shape :
  #id ->
  #content ->
  #replied_to -> comment's id
  #created_at ->
  #likes_count -> number of likes
  #you_liked -> boolean | define if you are on like this topic
  #user_creator -> {
    #id ->
    #fullname ->
    #photo ->
  }
*/
function comment(comment) {
  const { _id, content, created_at, replied_to, user_creator, other_fields: { logged_user_id }} = comment

  return {
    id: _id,
    content, created_at, replied_to,
    likes_count: comment.liked_by.length,
    you_liked: !!comment.liked_by.find(uid => uid === logged_user_id),
    user_creator: {
      id: user_creator._id,
      fullname: user_creator.profile.fullname,
      photo: user_creator.profile.photo,
    },
  };
}

export default {
  render,
  topic,

  render_comment,
  comment,
}
