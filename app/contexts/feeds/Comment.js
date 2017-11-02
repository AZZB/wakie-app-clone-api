import mongoose, { Schema } from 'mongoose'
import Lib from '../../lib'


mongoose.Promise = global.Promise


const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, "path is required"],
  },

  replied_to: { type: Schema.Types.ObjectId, ref: 'Comment' },

  created_at: { type: Date, 'default': Date.now },

  deleted_at: {type: Date, 'default': null},

  user_creator: { type: Schema.Types.ObjectId, ref: 'User' },

  liked_by: [ { type: Schema.Types.ObjectId, ref: 'User' } ],

})

// -------------------------- helpers ---------------------

export function cast(params) {
  return Lib.Tools.cast(params, 'content replied_to')
}

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment
