const express = require('express');
const router = express.Router();
const { createCategory, getCategory, updateCategory, deleteCategory } = require('@controllers/categoryController');
const auth = require('@middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/createCategory', upload.fields([{ name: 'image', maxCount: 1 }]), auth('admin'), createCategory);
router.get('/getCategory', auth('user', 'provider', 'admin'), getCategory);
router.post('/updateCategory', upload.fields([{ name: 'image', maxCount: 1 }]), auth('admin'), updateCategory);
router.delete('/deleteCategory/:id', auth('admin'), deleteCategory);

module.exports = router;