const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: Schema.ObjectId,
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name required']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email ID required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }
});

module.exports = User = mongoose.model("users", UserSchema);