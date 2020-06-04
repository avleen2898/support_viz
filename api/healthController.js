const express = require('express');
const router = express.Router();

router.get('/status', function (req, res) {
    res.locals.message = 'Server Status';
    res.locals.status = 'Running';
    res.status(200);
    res.render('status');
});

router.head('/status', (req, res) => {
    res.status(200).end();
});

module.exports = router;
