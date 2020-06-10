const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GardenSchema = new Schema({
    _id: Schema.ObjectId,
    owner: {
        type: String,
        required: [true, 'Owner for garden required']
    },
    data: [{
        name: {
            type: String,
            required: [true, 'Prayer owner name required']
        },
        face: {
            type: String
        },
        communityType: {
            type: Number,
            required: [true, 'Community type required']
        },
        prayers: {
            type: Array
        }
    }]
});

module.exports = Garden = mongoose.model("garden", GardenSchema);