const express = require('express');
const router = express.Router();
const { createService } = require('@controllers/serviceController');
const auth = require('@middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// router.post('/createService', upload.fields([{ name: 'service_photo', maxCount: 5 }]), auth('user', 'provider'), createService);

module.exports = router;