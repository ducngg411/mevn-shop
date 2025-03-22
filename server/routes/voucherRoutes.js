const express = require('express');
const router = express.Router();

const {
    createVoucher,
    getVouchers,
    getVoucherById,
    validateVoucher,
    updateVoucher,
    deleteVoucher,
} = require('../controllers/voucherController');

const { protect, admin } = require('../middleware/authMiddleware');

// Get all vouchers and create a voucher
router.route('/')
    .get(protect, admin, getVouchers)
    .post(protect, admin, createVoucher);

// Get, update, and delete a voucher
router.route('/:id')
    .get(protect, admin, getVoucherById)
    .put(protect, admin, updateVoucher)
    .delete(protect, admin, deleteVoucher);

// Validate a voucher
router.route('/validate')
    .post(protect, validateVoucher);

module.exports = router;

