'use strict';

module.exports = function(){
    return {
        SignUpValidation: (req, res, next) => {
            // Check for Validation
            req.checkBody('username', 'Username is Required').notEmpty();
            req.checkBody('username', 'Username must not be less than 5').isLength({min: 5});
            req.checkBody('email', 'Email is Required').notEmpty();
            req.checkBody('email', 'Email is Invalid').isEmail();
            req.checkBody('password', 'Password is Required').notEmpty();
            req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

            // Get Validation Error Messages
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg)
                    });

                    // Add error messages to flash
                    req.flash('error', messages);
                    console.log(error);
                    res.redirect('/signup')
                })
                .catch((err) => {
                    return next();
                })
        },

        LoginValidation: (req, res, next) => {
            // Check for Validation
            req.checkBody('email', 'Email is Required').notEmpty();
            req.checkBody('email', 'Email is Invalid').isEmail();
            req.checkBody('password', 'Password is Required').notEmpty();
            req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

            // Get Validation Error Messages
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg)
                    });

                    // Add error messages to flash
                    req.flash('error', messages);
                    res.redirect('/')
                })
                .catch((err) => {
                    return next();
                })

            }

    }
}