/**
  This file define a strategy for handling errors produced from different source
  into one way direction which we can filter the errors and describe it in clear way.

  we should use this strategy after getting an exception from any code.

  Currently I'm targetting the Controllers interface errors.

  using example:
    try {
      // any exception here
    } catch(e) {
      await Lib.error_handler(ctx, e, next, data)
    }
*/


import { Error as MongooseError} from 'mongoose'
import ErrorView from '../web/views/error'


export default async function(ctx, e, next, data = {}) {
  // LOG('data: ', data)

  if(e.name === 'MongoError' && e.code === 11000) {
    const duplicated_field = extract_field_from_path(extractDuplicatedField(e))
    LOG("dupication field: ", duplicated_field)
    ErrorView.render_error(ctx, 'Field exist', {[duplicated_field]: `${duplicated_field} is already exist`})
    return;
  }

  if(e instanceof MongooseError) {

    if(e.errors) {
      LOG("MongooseError with: ", e.errors)
      const errors = {}
      const keys = Object.keys(e.errors)
      keys.forEach(key => errors[extract_field_from_path(key)] = e.errors[key].message)

      ErrorView.render_error(ctx, 'Invalid data', errors)
      return;
    }

    if(e.name === 'CastError' && e.kind === 'ObjectId') {
      LOG("Cast ObjectId error")
      // TODO: I should not send this error in this way, I have to detect the cause of this error, for example maybe I need to send "User not found"
      ErrorView.render_error(ctx, 'data format is invalid', {id: 'Invalid id'})
      return;
    }
  }

  if(e.error == "CustomError") {
    ErrorView.render_error(ctx, e.reason(), e.errors(), e.status());
    return;
  }

  ErrorView.render_error(ctx, "Server Error", {}, 501)
}


function extract_field_from_path(path) {
  const result = path.split('.')
  return result[result.length-1]
}

function extractDuplicatedField(e) {
  try {
    var field = e.message.split(':')[2];
    field = field.split('_')[0];
    return field.trim()
  } catch (e) {
    console.log(e);
    //throw new CustomError('CodeError', 'could not parse e.message', {}, 501);
  }
}
