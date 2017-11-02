import supertest from 'supertest';
import { expect } from 'chai';
import server from './__test_server__'
import { send_request } from './__helpers__'
import { AccountUtils } from '../__share__'


const create_user_data = AccountUtils.create_user_data()
const invalid_user_data = AccountUtils.invalid_user_data()
const user_fixture = AccountUtils.user_fixture


describe('Senarios', () => {
  let request

  beforeAll(async () => {
    request = supertest(server.listen())
  })

  beforeEach(async () => {
    await AccountUtils.clean()
  })


  it('first senario', async () => {})

})
