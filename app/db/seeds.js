import AccountUtils from '../contexts/accounts'
import User from '../contexts/accounts/User'


export default async (env) => {
  if(env === 'test') { await run_test_seeds(); return; }
  if(env === 'dev') { await run_dev_seeds(); return; }

}


async function run_test_seeds() {
  await create_user()
}

async function run_dev_seeds() {
  await User.remove({})
}

async function create_user() {
  let user = await User.findOne({'credential.email': 'base_user@email.com'})
  if(user) return user

  const data = { credential: {email: 'base_user@email.com', password: 'base_user_password'}, profile: { fullname: 'base_user_fullname'}}
  user = await User.create(data)

  return user
}
