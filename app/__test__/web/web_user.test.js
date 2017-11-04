import supertest from 'supertest';
import { expect } from 'chai';
import server from './__test_server__'
import { send_request, login_process } from './__helpers__'
import { AccountUtils } from '../__share__'

const prefix = '/api_v1/users'

const create_user_data = AccountUtils.create_user_data()
const update_user_data = AccountUtils.update_user_data()
const invalid_user_data = AccountUtils.invalid_user_data()
const user_fixture = AccountUtils.user_fixture


describe('Web:Auth', () => {
  let request, token, logged_user

  beforeAll(async () => {
    request = supertest(server.listen())
    const result = await login_process(request)
    token = result.token
    logged_user = result.user
  })

  beforeEach(async () => {
    await AccountUtils.clean()
  })


  it('GET /api-v1/users/:id | return user', async () => {
    const user_id = (await user_fixture())._id
    const { body} = await  send_request(request, 'get', `${prefix}/${user_id}`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['user']).to.not.undefined
    const user = data['user']
    expect(user.id).to.equal(`${user_id}`)
  })

  it('PUT /api-v1/users | return user', async () => {
    await user_fixture()
    const result = await login_process(request, {email: 'some@email.com', password: 'some_password'})

    const { body } = await  send_request(request, 'put', `${prefix}`, update_user_data, result.token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['user']).to.not.undefined
    const user = data['user']
    expect(user.fullname).to.equal('updated_some_fullname')
  })

  it('GET /api-v1/users/:id/topics | return topics', async () => {
    const user_id = (await user_fixture())._id

    const { body } = await  send_request(request, 'get', `${prefix}/${user_id}/topics`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['topics']).to.not.undefined
    const user = data['topics']

  })

  it('GET /api-v1/users/:id/faves | return users', async () => {
    const user_id = (await user_fixture())._id

    const { body } = await  send_request(request, 'get', `${prefix}/${user_id}/faves`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['faves']).to.not.undefined
    const faves = data['faves']
    //console.log(faves);

  })

  it('GET /api-v1/users/:id/faved | return user', async () => {
    const user_id = (await user_fixture())._id

    const { body } = await  send_request(request, 'get', `${prefix}/${user_id}/faved`, token)
                              .expect('Content-Type', /json/)
                              .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['faved']).to.not.undefined
    const faves = data['faved']
    //console.log(faves);
  })


})
