'use strict';

const passport = require('passport');
const User = require('../models/users');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//  SignUp Middleware
passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3022/auth/google/callback',
    passReqToCallback: true
}, (req, accesstoken, refreshToken, profile, done) => {
    // Check if user already exist
    User.findOne({google:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;

            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                return done(null, newUser);
            })
        }
        
    });
}));


