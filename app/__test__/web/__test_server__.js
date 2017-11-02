import Koa from 'koa'
import koaBody from 'koa-body'
import CustomError from '../../lib/CustomError'
import router from '../../web/routes'
import connectToDB from '../../db/connect'

global.CustomError = CustomError

const koa = new Koa()

connectToDB('test')


koa.use(koaBody())
koa.use(router.routes())


if (!module.parent) {
  var server = koa.listen(3000, () => {
    console.log('server running on port 3000');
  });
}


global.LOG = (message, ...args) => {
  if(true) return;

  console.log('/ ---------------'+ message +'------------------ ');
  console.log(...args);
  console.log(' ----------------------------------------------- / ');
}


export default koa
