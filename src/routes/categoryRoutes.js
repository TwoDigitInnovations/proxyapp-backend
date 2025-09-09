const express = require('express');
const router = express.Router();
const { createCategory, getCategory, updateCategory, deleteCategory } = require('@controllers/categoryController');
const auth = require('@middlewares/authMiddleware');

router.post('/createCategory', auth('admin'), createCategory);
router.get('/getCategory', auth('user', 'admin'), getCategory);
router.post('/updateCategory', auth('admin'), updateCategory);
router.delete('/deleteCategory/:id', auth('admin'), deleteCategory);

module.exports = router;