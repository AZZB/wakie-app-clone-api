import { expect } from 'chai';
import Feeds from '../../contexts/feeds'
import connectToDB from '../../db/connect'
import { AccountUtils, FeedUtils } from '../__share__'


const create_topic_data = FeedUtils.create_topic_data()
const invalid_topic_data = FeedUtils.invalid_topic_data()

const create_comment_data = FeedUtils.create_comment_data()
const invalid_comment_data = FeedUtils.invalid_comment_data()

const user_fixture = AccountUtils.user_fixture
const topic_fixture = FeedUtils.topic_fixture
const comment_fixture = FeedUtils.comment_fixture

describe('Context:Accounts', () => {

  beforeAll(async () => {
    await connectToDB('test')
  })

  beforeEach(async () => {
    await FeedUtils.clean()
  })


  it('get_topics | return list of topics', async () => {

  })

  it('get_topic | return topic', async () => {
    const user_id = (await user_fixture())._id
    const { _id } = await topic_fixture('', user_id)
    const topic = await Feeds.get_topic(_id, user_id)
    expect(`${topic._id}` ).to.equal(`${_id}`)
    expect(`${topic.user_creator._id}`).to.equal(`${user_id}`)
  })

  it('create_topic | with valid data : return topic', async () => {
    const user_id = (await user_fixture())._id
    const topic = await Feeds.create_topic({...create_topic_data, user_id})
    expect(`${topic.user_creator._id}`).to.equal(`${user_id}`)
  })

  it('does not create_topic when the data is invalid', async () => {
    try {
      const user_id = (await user_fixture())._id
      const topic = await Feeds.create_topic({...invalid_topic_data, user_id})
    } catch (e) {
      return;
    }
    throw new Error('test failed : create_topic with invalid data')
  })

  it('remove_topic ', async () => {
    const user_id = (await user_fixture())._id
    const topic = await topic_fixture('', user_id)
    await Feeds.remove_topic(topic._id, user_id)

    try {
      await Feeds.get_topic(topic._id, 'user_id_here')
    } catch (e) {
      return;
    }
    throw new Error('test failed : create_topic with invalid data')
  })

  it('get_comments: return list of comments', async () => {

  })

  it('get_comment: return comment', async () => {
    const user_id = (await user_fixture())._id
    const id = (await comment_fixture('', user_id))._id
    const comment = await Feeds.get_comment(id, user_id)

    expect(`${comment._id}` ).to.equal(`${id}`)
    expect(`${comment.user_creator._id}`).to.equal(`${user_id}`)
  })

  it('create_comment when the data is valid | return comment', async () => {
    const user_id = (await user_fixture())._id
    const topic_id = (await topic_fixture('', user_id))._id
    const comment = await Feeds.create_comment({...create_comment_data, user_id, topic_id})

    expect(`${comment.user_creator._id}`).to.equal(`${user_id}`)
  })

  it('remove_comment ', async () => {
    const comment = await comment_fixture()
    await Feeds.remove_comment(comment)

    try {
      await Feeds.get_comment(comment._id, 'user_id_here')
    } catch (e) {
      return;
    }
    throw new Error('test failed : create_comment with invalid data')
  })

})
