const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateLoginInput = require("../services/validation/login");
const validateRegisterInput = require("../services/validation/register");

const User = require("../models/User");

router.post("/login", (req, res, next) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user => {
        if (!user) {
            return res.status(404).json({email: "Email not found!"});
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
                jwt.sign(
                    payload,
                    process.env.JWT_KEY,
                    {
                        expiresIn: 3600
                    },
                    (err, token) => {
                        if (err) next(err);
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(400).json({password: "Incorrect password!"});
            }
        });
    });
});

router.get('/signOut', function (req, res, next) {
    res.clearCookie('t');
    return res.status(200).json({
        message: 'Sign out successful!'
    });
});

router.post('/register', function (req, res, next) {
    console.log('Checking Register')
    const {errors, isValid} = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            res.status(400).json({email: "Email already exists!"});
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser.save()
                    .then(user => res.json(user))
                    .catch(err => next(err));
            });
        });
    });
});

module.exports = router;
