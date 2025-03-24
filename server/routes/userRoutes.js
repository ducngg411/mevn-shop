const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users and admin routes
router.route('/')
    .get(protect, admin, getUsers);

// Get, update, and delete user by ID
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/:id/orders')
    .get(protect, admin, getUserOrders);

module.exports = router;