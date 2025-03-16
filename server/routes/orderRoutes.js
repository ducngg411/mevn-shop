const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getRemainingTime,
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/remaining-time')
    .get(protect, getRemainingTime);

module.exports = router;