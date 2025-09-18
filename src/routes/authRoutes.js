const express = require('express');
const router = express.Router();
const { login, register, sendOTP, verifyOTP, changePassword, getProfile, updateProfile, getProvider, updateVerifyandSuspendStatus, nearMeServicebyCategory } = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
// const { upload } = require("@services/fileUpload");
const upload = require('../middlewares/upload');

router.post('/login', login);
router.post('/register', register);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/changePassword', changePassword);
router.get('/getProfile', auth('user', 'provider'), getProfile);
router.post('/updateProfile', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'document', maxCount: 5 }]), auth('user', 'provider'), updateProfile);
// router.post('/user/fileupload', upload.single("file"), fileUpload);
router.get('/getProvider', auth('user', 'provider', 'admin'), getProvider);
router.post('/updateVerifyandSuspendStatus', auth('user', 'provider', 'admin'), updateVerifyandSuspendStatus);
router.post('/nearMeServicebyCategory', auth('user', 'provider', 'admin'), nearMeServicebyCategory);

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
