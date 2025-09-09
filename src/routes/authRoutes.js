const express = require('express');
const router = express.Router();
const { login, register, sendOTP, verifyOTP, changePassword, getProfile, updateProfile } = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
// const { upload } = require("@services/fileUpload");

router.post('/login', login);
router.post('/register', register);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/changePassword', changePassword);
router.get('/getProfile', auth('user'), getProfile);
router.post('/updateProfile', auth('user'), updateProfile);
// router.post('/user/fileupload', upload.single("file"), fileUpload);

router.get('/admin-only', auth('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin user!' });
});

router.get('/admin-seller', auth('admin', 'seller'), (req, res) => {
  res.json({ message: 'Welcome, admin or seller!' });
});

router.get('/protected', auth(), (req, res) => {
  res.json({ message: 'Welcome, authenticated user!', user: req.user });
});

module.exports = router;
