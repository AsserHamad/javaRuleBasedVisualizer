const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Errors = require('../errors/Errors');

// Validators
const isEmail = require('validator/lib/isEmail');

const UserSchema = new Schema({
    email: {
        type : String,
        unique: "This email is already in use",
        required: "Email is required",
        validate: {
            validator: isEmail,
            message: "Invalid Email"
        }
    },
    password: {
        type: "String",
        validate: {
            validator: input =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(input),
            message: "Invalid password, must contain at least 8 characters.\
             One digit, one lowercase and one uppercase letter"
        }
    }
})

UserSchema.pre('save', (next) => {
    const { password } = this;
    bcrypt
        .hash(password, 10)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => next(new Errors.InternalServerError()));
})

//Mongo shit
const errorHandler = function (error, doc, next) {
    let err;
    if (error.name === "MongoError" && error.code === 11000) {
        err = {
            errors: [{
                path: error.message.match(/\$(?!\$).*_/)[0].slice(1, -1),
                message: "Duplicate key!"
            }]
        };
        return next(new Errors.BaseError(err, 409));
    }
    next(new Errors.BaseError(err, 422));
};

UserSchema.post("save", errorHandler);
UserSchema.post("update", errorHandler);

module.exports = mongoose.model("User", UserSchema);
