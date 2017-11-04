import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import Lib from '../../lib'


mongoose.Promise = global.Promise

const UserSchema = new Schema({

  created_at: { type: Date, 'default': Date.now },

  deleted_at: {type: Date, 'default': null},

  confirmed: { type: Boolean, 'default': false },

  credential: {

    email: {
      index: true,
      type: String,
      unique: [true, 'email is already exist'],
    },

    password: {
      type: String,
      // required: [true, 'password is required'],
    },

    facebook_id: { type: String },
  },

  profile: {

    fullname: { type: String, default: '' },

    bio: { type: String },

    photo: { type: String },

    birth_day: { type: Date },

    last_online: { type: Date },

    private: { type: Boolean, 'default': false },

    // timezone

    topics_created: { type: Number, 'default': 0 },

    likes_given: { type: Number, 'default': 0 },

    likes_received: { type: Number, 'default': 0 },

    comments_given: { type: Number, 'default': 0 },

    comments_received: { type: Number, 'default': 0 },
  },



});


// --------------------------- validators --------------------------

UserSchema.path('credential.email')
  .validate(
    v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
    'email has an invalid format'
  );



// --------------------------- password encryption --------------------
const SALT_FACTOR = 10;
const noop = () => {};

UserSchema.pre('save', function(done) {
  const user = this;
  if(!user.isModified('credential.password')) return done();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if(err) return done(err);

    bcrypt.hash(user.credential.password, salt, noop, (err, hashedPassword) => {
      if(err) return done(err);
      user.credential.password = hashedPassword;
      done();
    });

  });

});


// -------------------------- methods ---------------------------
UserSchema.methods.checkPassword = function(guess) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(guess, this.credential.password, (err, isMatch) => {
      (err)? reject(err) : resolve(isMatch);
    });
  });
}


// -------------------------- helpers ---------------------

export function cast(params) {
  return Lib.Tools.cast(params, 'fullname bio birth_day private')
}


const User = mongoose.model('User', UserSchema)

export default User
