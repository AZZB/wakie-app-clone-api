/*
  if a function start with render means it will render a response using ctx.body
  else it's just describe the format of data
*/

import Lib from '../../lib'


function render(ctx, data, status) {
  Lib.Tools.abstract_render(ctx, data, status)(user, 'user', 'users')
}


/**
  this function gonna return user in this shape :
  #id ->
  #fullname ->
  #photo ->
  #bio ->
  #faves_count -> number of users that they faved you
  #faved_count -> number of users that you fave
  #birth_day
  #registration_date ->
  #private -> boolean | define if the profile is private
  #topics_created ->
  #likes_given ->
  #likes_received ->
  #comments_given ->
  #comments_received ->
  #confirmed -> boolean | define if the user is confirmed by email verification
  #you_fave -> boolean | define if you're faving this profile
*/
function user({ _doc: {_id, confirmed, created_at, profile}, other_fields}) {
  return {
    id: _id,
    confirmed,
    ...profile,
    registration_date: created_at,
    ...other_fields,
  }
}


export default {
  render,
  user,
}
