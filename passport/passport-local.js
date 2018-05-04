'use strict';

const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//  SignUp Middleware
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: 'true'
}, (req, email, password, done) => {

    User.findOne({'email': email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'User with email already exist'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));


//  Login Middleware
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: 'true'
}, (req, email, password, done) => {

    User.findOne({'email': email}, (err, user) => {
        if(err){
            return done(err);
        }

        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }

            return done(null, user);
    });
}));