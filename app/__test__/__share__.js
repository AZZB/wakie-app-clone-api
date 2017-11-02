import Accounts from '../contexts/accounts'
import Feeds from '../contexts/feeds'



const create_user_data = { email: 'some@email.com', password: 'some_password', fullname: 'some_fullname' }
const update_user_data = {fullname: 'updated_some_fullname' }
const invalid_user_data = { email: '', password: '', fullname: ''}

const create_topic_data = { content: 'some_content', tags: ['tag_1', 'tag_2']}
const invalid_topic_data = { }

const create_comment_data = { content: 'some_content' }
const invalid_comment_data = { }


function get(model, flag) {
  return (flag === 'doc')? model._doc : model
}

async function get_user_id(user_id) {
  return !user_id ? (await AccountUtils.user_fixture('doc'))._id : user_id
}

async function get_topic_id(topic_id, user_id) {
  return !topic_id ? (await FeedUtils.topic_fixture('doc', user_id))._id : topic_id
}

function assign(key, base_data) {
  return (data = {}) => ({[key]: {...base_data, ...data }})
}

export const AccountUtils = {
  create_user_data: assign('user', create_user_data),
  update_user_data: assign('user', update_user_data),
  invalid_user_data: assign('user', invalid_user_data),

  user_fixture: async (flag) => {
    const user = await Accounts.create_user(AccountUtils.create_user_data())
    return get(user, flag)
  },

  futured_user: async () => {

  },

  clean: async () => {
    await Accounts.clean()
  },
}


export const FeedUtils = {
  create_topic_data: assign('topic', create_topic_data),
  invalid_topic_data: assign('topic', invalid_topic_data),

  topic_fixture: async (flag, user_id) => {
    user_id = await get_user_id(user_id)
    const attrs = {...FeedUtils.create_topic_data(), user_id}
    const topic = await Feeds.create_topic(attrs)
    return get(topic, flag)
  },

  create_comment_data: assign('comment', create_comment_data),
  invalid_comment_data: assign('comment', invalid_comment_data),

  comment_fixture: async (flag, user_id, topic_id) => {
    user_id = await get_user_id(user_id)
    topic_id = await get_topic_id(topic_id, user_id)
    const comment = await Feeds.create_comment({...FeedUtils.create_comment_data(), user_id, topic_id})
    return get(comment, flag)
  },

  clean: async () => {
    await Feeds.clean()
  }
}
