const Garden = require('../models/Garden');

async function getGardenDetails(userId) {
    let gardenDetails = await Garden.findOne({owner: userId}).exec();

    if (!gardenDetails) {
        throw new Error("Garden not found!");
    }

    return gardenDetails;
}

module.exports.getGardenDetails = getGardenDetails;