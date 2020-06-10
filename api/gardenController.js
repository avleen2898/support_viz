const express = require('express');
const router = express.Router();

const GardenService = require('../services/GardenService')

router.get('/view/:userId', async function (req, res, next) {
    // console.log('View garden request by ', req.user.email);

    let userId = req.params.userId;
    let gardenDetails;

    try {
        gardenDetails = await GardenService.getGardenDetails(userId);
    } catch(err) {
        return next(err);
    }

    res.status(200).json(gardenDetails);
});

module.exports = router;
