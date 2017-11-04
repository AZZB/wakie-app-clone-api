const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config();

export const config = {
    clientId: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackUrl: `${process.env.BASE_URL}/auth/facebook-callback`,
    profileFields: ['id', 'displayName', 'photos', 'email'],
}

console.log(config);

passport.use(new FacebookStrategy({
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackUrl,
  profileFields: config.profileFields,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
