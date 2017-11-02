import mongoose from 'mongoose'
import run_seeds from './seeds'

mongoose.Promise = global.Promise


function connect(env, options = {}) {
  (async () => {

    if(mongoose.connection.db) {
      console.log('the connection is already opened');
      return;
    }

    const config = env === 'dev'? devConfig : env === 'test'? testConfig : prodConfig
    options = {...config.options, options}

    try {
      await mongoose.connect(config.url, options)
      console.log('connection to mongodb success');
      await run_seeds(env)
    } catch (e) {
      console.log('--------- Mongodb connection failed --------------');
      console.log(e);
      console.log('--------------------------------------------------');
    }

  })()

}



const devConfig = {
  url: 'mongodb://localhost:27017/wakie-clone-dev',
  options: {},
}

const testConfig = {
  url: 'mongodb://localhost:27017/wakie-clone-test',
  options: {},
}

const prodConfig = {
  url: '',
  options: {},
}




export default connect
