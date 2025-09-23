const express = require('express');
const router = express.Router();
const { createContent, getContent } = require('@controllers/contentController');
const auth = require('@middlewares/authMiddleware');

router.post('/createContent', auth('user', 'provider', 'admin'), createContent);
router.get('/getContent', auth('user', 'provider', 'admin'), getContent);

module.exports = router;