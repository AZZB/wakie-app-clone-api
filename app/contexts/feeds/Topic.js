import mongoose, { Schema } from 'mongoose'
import Lib from '../../lib'


mongoose.Promise = global.Promise


const TopicSchema = new Schema({
  content: {
    type: String,
    required: [true, "content is required"],
  },

  tags: [String],

  created_at: { type: Date, 'default': Date.now },

  deleted_at: {type: Date, 'default': null},

  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],

  liked_by: [ { type: Schema.Types.ObjectId, ref: 'User' } ],

  user_creator: { type: Schema.Types.ObjectId, ref: 'User' },

})

// -------------------------- helpers ---------------------

export function cast(params) {
  return Lib.Tools.cast(params, 'content tags')
}

const Topic = mongoose.model('Topic', TopicSchema)

export default Topic
