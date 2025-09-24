const express = require('express');
const router = express.Router();
const { createService, getService, updateService, deleteService, nearMeServicebyCategory } = require('@controllers/serviceController');
const auth = require('@middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/createService', upload.fields([{ name: 'service_photo', maxCount: 5 }]), auth('provider'), createService);
router.get('/getService', auth('provider'), getService);
router.post('/updateService', upload.fields([{ name: 'service_photo', maxCount: 5 }]), auth('provider'), updateService);
router.delete('/deleteService/:id', auth('admin'), deleteService);
router.post('/nearMeServicebyCategory', auth('user', 'provider', 'admin'), nearMeServicebyCategory);

module.exports = router;