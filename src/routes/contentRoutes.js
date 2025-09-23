const express = require('express');
const router = express.Router();
const { createContent, getContent } = require('@controllers/contentController');
const auth = require('@middlewares/authMiddleware');

router.post('/createContent', auth('admin'), createContent);
router.get('/getContent', getContent);

module.exports = router;