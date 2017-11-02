import mongoose, { Schema } from 'mongoose'
import Lib from '../../lib'


mongoose.Promise = global.Promise


const FaveSchema = new Schema({
  confirmed: { type: Boolean, 'default': true },

  created_at: { type: Date, 'default': Date.now },

  from: { type: Schema.Types.ObjectId, ref: 'User' },

  to: { type: Schema.Types.ObjectId, ref: 'User' },

})

// -------------------------- helpers ---------------------

export function cast(params) {
  return Lib.Tools.cast(params, 'to')
}

const Fave = mongoose.model('Fave', FaveSchema)

export default Fave
