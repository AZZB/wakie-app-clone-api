

function abstract_render(ctx, data, status = 200) {
  return (formater, key, key_plurial) => {
    let result;

    if(Array.isArray(data)) {
      result = data.map( v => formater(v))
      key = key_plurial
    } else if(typeof data === 'object') {
      result = formater(data)
    }

    ctx.status = status

    ctx.body = {
      data: {[key]: result }
    }
  }
}


function cast(params, str) {
  const arr = str.split(/\s+/)
  const result = {}

  for(let i = 0; i < arr.length; i++) {
    const key = arr[i]
    result[key] = params[key]
  }

  return result
}


function check_attrs(attrs, str, type = 'Data-Format-invalid', errors = {}) {
  const arr = str.split(/\s+/)

  for(let i = 0; i < arr.length; i++) {
    if(attrs[arr[i]] === undefined) throw new CustomError(type, 'Data format is invalid', errors, 400)
  }
}



/**
  this function help to fix populated model for just to get its ID
*/
function model_fixer(model) {
  return (typeof model._id === 'undefined')? model : model._id
}


export default {
  abstract_render,
  cast,
  check_attrs,
  model_fixer,
}
