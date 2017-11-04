import { expect } from 'chai';
import Accounts from '../../contexts/accounts'
import connectToDB from '../../db/connect'
import { AccountUtils } from '../__share__'


const create_user_data = AccountUtils.create_user_data()
const update_user_data = AccountUtils.update_user_data()
const invalid_user_data = AccountUtils.invalid_user_data()

const user_fixture = AccountUtils.user_fixture

describe('Context:Accounts', () => {

  beforeAll(async () => {
    await connectToDB('test')
  })

  beforeEach(async () => {
    await AccountUtils.clean()
  })


  it('get_user when the user exist : return user', async () => {
    const { _id } = await user_fixture()
    const user = await Accounts.get_user(_id, '59f9a288d7df05311c84e05c')


  })

  it('create_user when the data is valid', async () => {
    const {_doc: user} = await Accounts.create_user(create_user_data)
    expect(user._id).to.not.undefined
    expect(user.credential.email).to.equal('some@email.com')
    expect(user.credential.password).to.not.equal('some_password')
    expect(user.profile.fullname).to.equal('some_fullname')
  })

  it('does not create_user when the data is invalid', async () => {
    try {
      await Accounts.create_user(invalid_user_data)
    } catch (e) {
      return;
    }
    throw new Error('test failed : create_user with invalid data')
  })

  it('update_user when the data is valid', async () => {
    const user_id = (await AccountUtils.user_fixture())._id
    const user = await Accounts.update_user(user_id, update_user_data)

    expect(`${user_id}`).to.equal(`${user._id}`)
    expect(user.profile.fullname).to.equal('updated_some_fullname')
  })

  it('get_user_faves', async () => {
    const { user_id, other_user_id } = await create_two_user()
    const result = await Accounts.add_fave(user_id, other_user_id)

    const faves = await Accounts.get_user_faves(other_user_id)
    // console.log(faves);
  })

  it('get_user_faved', async () => {
    const { user_id, other_user_id } = await create_two_user()
    const result = await Accounts.add_fave(user_id, other_user_id)

    const faved = await Accounts.get_user_faved(user_id)
    // console.log(faved);
  })

  it('add_fave && remove_fave', async () => {
    const { user_id, other_user_id } = await create_two_user()

    const result = await Accounts.add_fave(user_id, other_user_id)

    expect(result.success).to.equal(true)

    await Accounts.remove_fave(user_id, other_user_id)
  })


})


async function create_two_user() {
  const user_id = (await AccountUtils.user_fixture())._id
  const attrs = {email: 'other@email.com', fullname: 'other_fullname'}
  const other_user_id = (await AccountUtils.user_fixture('', attrs))._id

  return {user_id, other_user_id}
}
