const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStratey = require('passport-google-oauth20');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.use(
  new GoogleStratey(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Sign In With Google');
      User.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          // user already exists
          done(null, existingUser);
        } else {
          const user = { googleID: profile.id, name: profile.displayName, email: profile.emails[0].value, date: new Date() };
          new User(user).save().then(user => done(null, user));
        }
      });
    }
  )
);

/*

// @ FaceboolStrategy for social login 

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

*/
