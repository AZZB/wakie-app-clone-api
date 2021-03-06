import Koa from 'koa'
import koaLogger from 'koa-logger'
import koaBody from 'koa-body'
import connectToDB from './app/db/connect'
import router from './app/web/routes'
import Middlewares from './app/lib/middlewares'
import CustomError from './app/lib/CustomError'
import passport from './app/lib/passport'


require('dotenv').config();

const koa = new Koa()

global.CustomError = CustomError

const mode = is_dev()? "dev" : "prod";
connectToDB(mode)

if(is_dev()) koa.use(koaLogger());
koa.use(Middlewares.upload_path(__dirname))
koa.use(koaBody())
koa.use(passport.initialize());
koa.use(router.routes())
//koa.use(router.allowedMethods())



if (!module.parent) {
  const PORT = process.env.PORT || 3000
  var server = koa.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}


global.LOG = (message, ...args) => {
  if(!is_dev()) return;

  console.log('/ ---------------'+ message +'------------------ ');
  console.log(...args);
  console.log(' ----------------------------------------------- / ');
}


function is_dev() {
  return process.env.NODE_ENV !== 'production'
}
