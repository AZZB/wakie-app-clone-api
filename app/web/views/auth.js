/*
  if a function start with render means it will render a response using ctx.body
  else it's just describe the format of data
*/


import Lib from '../../lib'
import UserView from './user'

function render(ctx, user, token) {
  ctx.body = {
    data: {
      user: UserView.user(user),
      token,
    },
  }
}

function auth_user({ _doc: {_id}}) {
  return { id: _id }
}


function render_email_verification_success(ctx, user) {
  if(!user) { ctx.status = 404; ctx.body = 'Not found'; return;}
  // TODO: we should render a template here
  ctx.body = {success: true}
}

export default {
  render,
  auth_user,

  render_email_verification_success,
}
