const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// register user

router.post('/register', registerUser);

// login user

router.post('/login', loginUser);

// forgot password
router.post('/forgot-password', forgotPassword);

// reset password
router.post('/reset-password', resetPassword);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/change-password')
    .put(protect, changePassword);


// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports = router;