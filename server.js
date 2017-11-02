import Koa from 'koa'
import koaLogger from 'koa-logger'
import koaBody from 'koa-body'
import connectToDB from './app/db/connect'
import router from './app/web/routes'

const koa = new Koa()

const mode = is_dev()? "dev" : "prod";
connectToDB(mode)

if(is_dev()) koa.use(koaLogger());
koa.use(koaBody())
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
