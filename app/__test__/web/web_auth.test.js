import supertest from 'supertest';
import { expect } from 'chai';
import server from './__test_server__'
import { send_request } from './__helpers__'
import { AccountUtils } from '../__share__'

const prefix = '/auth'

const create_user_data = AccountUtils.create_user_data()
const invalid_user_data = AccountUtils.invalid_user_data()
const user_fixture = AccountUtils.user_fixture


describe('Web:Auth', () => {
  let request

  beforeAll(async () => {
    request = supertest(server.listen())
  })

  beforeEach(async () => {
    await AccountUtils.clean()
  })


  it('POST /auth/register with valid data - return user', async () => {
    const { body } = await send_request(request, 'post', `${prefix}/register`, create_user_data)
                            .expect('Content-Type', /json/)
                            .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['user']).to.not.undefined
    expect(data['token']).to.not.undefined
  })

  it('POST /auth/register with an existed email - return errors', async () => {
    await user_fixture()
    const { body } = await send_request(request, 'post', `${prefix}/register`, create_user_data)
                            .expect('Content-Type', /json/)
                            .expect(400)

    expect(body['reason']).to.not.undefined
    expect(body['errors']).to.not.undefined
    expect(body['errors']['email']).to.equal('email is already exist')

  })

  it('POST /auth/register with invalid data - return errors', async () => {
    const { body } = await send_request(request, 'post', `${prefix}/register`, invalid_user_data)
                            .expect('Content-Type', /json/)
                            .expect(400)

    expect(body['reason']).to.not.undefined
    expect(body['errors']).to.not.undefined
    //expect(body['errors']['email']).to.equal('email has an invalid format')
  })

  it('POST /auth/login with valid data - return user', async () => {
    await user_fixture()
    const { body } = await send_request(request, 'post', `${prefix}/login`, {login: 'some@email.com', password: 'some_password'})
                            .expect('Content-Type', /json/)
                            .expect(200)

    expect(body['data']).to.not.undefined
    const data = body['data']
    expect(data['user']).to.not.undefined
    expect(data['token']).to.not.undefined
  })

  it('POST /auth/login with invalid data - return erros', async () => {
    await user_fixture()
    const { body } = await send_request(request, 'post', `${prefix}/login`, {login: 'invalid@email.com', password: 'invalid_password'})
                            .expect('Content-Type', /json/)
                            .expect(401)

    expect(body['reason']).to.equal("Authentication failed")
    expect(body['errors']).to.not.undefined
  })

})
