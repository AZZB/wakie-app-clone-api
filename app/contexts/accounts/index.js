import User, { cast as user_cast } from './User'
import Fave from './Fave'
import Lib from '../../lib'
import { get_user_topics } from '../feeds'

const check_attrs = Lib.Tools.check_attrs


async function get_user(id, logged_user_id) {
  const user = await User.findById(id, '-credential')
  if(!user || user.deleted_at) throw new CustomError('UserError', 'User not found')
  return await shape_user_info(user, logged_user_id)
}

async function create_user(attrs) {
  check_attrs(attrs, 'user')
  const {user: { email, password, fullname }} = attrs
  const user = await User.create({ credential: {email, password}, profile: {fullname} })
  return await get_user(user._id)
}

async function update_user(user_id, attrs) {
  let user = await User.findById(user_id)
  check_attrs(attrs, 'user')
  const { user: user_data } = attrs
  const keys = Object.keys(user_cast(user_data))
  keys.forEach(k => user.profile[k] = user_data[k])
  user = await user.save()

  return await get_user(user._id)
}


async function get_user_faves(user_id) {
  const faves = await Fave.find({to: user_id, confirmed: true}).populate('from', 'profile')
  return faves
}

async function get_user_faved(user_id) {
  const faved = await Fave.find({from: user_id, confirmed: true}).populate('to', 'profile')
  return faved
}

async function add_fave(from, to) {
  let fave = await Fave.findOne({from, to})
  if(!fave) fave = await Fave.create({from, to})

  return {
    success: true,
  }
}

async function remove_fave(from, to_remove) {
  await Fave.remove({from, to: to_remove})
}

async function authenticate_by_login_password(login, password) {
  const user = await User.findOne({'credential.email': login})
  if(!user) throw new CustomError("AuthError", "Authentication failed", {login: "this login does not exist"}, 401)
  const isMatch = await user.checkPassword(password)
  if(!isMatch) throw new CustomError("AuthError", "Authentication failed", {}, 401)

  return await get_user(user._id)
}


async function clean() {
  await Fave.remove({})
  await User.remove({'credential.email': {$not: /base_user@email.com/}})
}


// ------------------- helpers -----------------
async function shape_user_info(user, logged_user_id) {
  const faves_count = await Fave.where({to: user._id}).count()
  const faved_count = await Fave.where({from: user._id}).count()
  const you_fave = !logged_user_id? false : (await Fave.findOne({from: logged_user_id, to: user._id})) !== null

  user.other_fields = {
    faves_count,
    faved_count,
    you_fave
  }
  return user
}


export default {
  get_user,
  create_user,
  update_user,

  get_user_faves,
  get_user_faved,
  add_fave,
  remove_fave,

  authenticate_by_login_password,

  clean,
}
