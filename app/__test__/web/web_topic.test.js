import supertest from 'supertest';
import { expect } from 'chai';
import server from './__test_server__'
import { send_request, login_process } from './__helpers__'
import { AccountUtils, FeedUtils } from '../__share__'


const prefix = '/api_v1/topics'


const create_topic_data = FeedUtils.create_topic_data()
const invalid_topic_data = FeedUtils.invalid_topic_data()

const create_comment_data = FeedUtils.create_comment_data()
const invalid_comment_data = FeedUtils.invalid_comment_data()

const user_fixture = AccountUtils.user_fixture
const topic_fixture = FeedUtils.topic_fixture
const comment_fixture = FeedUtils.comment_fixture


describe('Web:Auth', () => {
  let request, token, logged_user

  beforeAll(async () => {
    request = supertest(server.listen())
    const result = await login_process(request)
    token = result.token
    logged_user = result.user
  })

  beforeEach(async () => {
    await FeedUtils.clean()
  })


  it('GET /api-v1/topics | return list of topics', async () => {
    const topic_id = (await FeedUtils.topic_fixture())._id
    const { body } = await  send_request(request, 'get', `${prefix}`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['topics']).to.not.undefined
    const topics = data['topics']
    expect(topics.length).to.equal(1)
  })

  it('GET /api-v1/topics/:id | return topic', async () => {
    const topic_id = (await FeedUtils.topic_fixture())._id
    const { body } = await  send_request(request, 'get', `${prefix}/${topic_id}`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['topic']).to.not.undefined
    const topic = data['topic']
    expect(topic.id).to.equal(`${topic_id}`)
  })

  it('POST /api-v1/topics | create topic and return it', async () => {
    const { body } = await  send_request(request, 'post', `${prefix}`, create_topic_data, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['topic']).to.not.undefined
    const topic = data['topic']
    expect(topic.user_creator.id).to.equal(logged_user.id)
  })

  it('POST /api-v1/topics | dont create topic when the data is invalid and return errors', async () => {
    const { body } = await  send_request(request, 'post', `${prefix}`, invalid_topic_data, token)
                              .expect('Content-Type', /json/)
                              .expect(400)

    expect(body['reason']).to.not.undefined
    expect(body['errors']).to.not.undefined
  })

  it('DEL /api-v1/topics/:id | delete topic', async () => {
    const topic_id = (await FeedUtils.topic_fixture())._id
    const { body } = await  send_request(request, 'del', `${prefix}/${topic_id}`, token)
                              .expect(204)
  })

  it('POST /api-v1/topics/:id/like', async () => {
    const topic_id = (await FeedUtils.topic_fixture())._id
    const { body } = await  send_request(request, 'post', `${prefix}/${topic_id}/like`, {}, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data.success).to.be.true
  })

  it('GET /api-v1/topics/:id/comments | return list of comments', async () => {
    const user_id = (await user_fixture())._id
    const topic_id = (await topic_fixture('', user_id))._id
    await comment_fixture('', user_id, topic_id)

    const { body } = await  send_request(request, 'get', `${prefix}/${topic_id}/comments`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['comments']).to.not.undefined
    const comments = data['comments']
    expect(comments.length).to.equal(1)
  })

  it('POST /api-v1/users/:id/comments | create comment and return it', async () => {
    const topic_id = (await FeedUtils.topic_fixture())._id
    const { body } = await  send_request(request, 'post', `${prefix}/${topic_id}/comments`, create_comment_data, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['comment']).to.not.undefined
    const comment = data['comment']
    expect(comment.user_creator.id).to.equal(logged_user.id)
  })

  it('DEL /api-v1/topics/comments/:id | delete comment', async () => {
    const topic_id = (await FeedUtils.topic_fixture('', logged_user.id))._id
    const id = (await comment_fixture('', logged_user.id, topic_id))._id
    const { body } = await  send_request(request, 'del', `${prefix}/comments/${id}`, token)
                              .expect(204)
  })

  it('POST /api-v1/topics/comments/:id/like', async () => {
    const id = (await comment_fixture())._id
    const { body } = await  send_request(request, 'post', `${prefix}/comments/${id}/like`, {}, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data.success).to.be.true
  })



})
