const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/:id/orders')
    .get(protect, admin, getUserOrders);

module.exports = router;

