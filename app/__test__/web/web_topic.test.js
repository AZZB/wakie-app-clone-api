import supertest from 'supertest';
import { expect } from 'chai';
import server from './__test_server__'
import { send_request, login_process } from './__helpers__'
import { AccountUtils, FeedUtils } from '../__share__'


const prefix = '/api-v1/topics'


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


  it('GET /api-v1/topics | return list of topics', async () => {})

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

  it('GET /api-v1/topics/:id/comments | return list of comments', async () => {})

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


})
