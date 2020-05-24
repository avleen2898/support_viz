const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post('/register', function (req, res, next) {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            res.status(400).send('Email already exists!');
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
