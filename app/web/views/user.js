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


function render_faves(ctx, data, status) {
  Lib.Tools.abstract_render(ctx, data, status)(faves, 'fave', 'faves')
}

function render_faved(ctx, data, status) {
  Lib.Tools.abstract_render(ctx, data, status)(faves, 'fave', 'faved')
}

/**
  this function gonna return fave in this shape :
  #id -> user_id that you're faving
  #fullname ->
  #photo ->
  #added_at ->
  #you_fave -> boolean | define if you're faving this profile
*/
function faves({ _doc: {created_at, from: { _id, profile }}}) {
  return {
    id: _id,
    fullname: profile.fullname,
    photo: profile.photo,
    added_at: created_at,
  }
}

function faved({ _doc: {created_at, to: { _id, profile }}}) {
  return {
    id: _id,
    fullname: profile.fullname,
    photo: profile.photo,
    added_at: created_at,
  }
}



function render_dumb(ctx, result) {
  ctx.body = {
    data: result,
  }
}


export default {
  render,
  user,

  render_faves,
  faves,

  render_faved,
  faved,

  render_dumb,
}
