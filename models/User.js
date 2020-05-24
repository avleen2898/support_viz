const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name required']
    },
    email: {
        type: String,
        required: [true, 'Email ID required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }
});

module.exports = User = mongoose.model("users", UserSchema);