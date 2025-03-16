const express = require('express');
const router = express.Router();
const {
	createAccount,
	createBulkAccounts,
	getAccountsByProduct,
	updateAccount,
	deleteAccount,
} = require('../controllers/accountController');
const { protect, admin } = require('../middleware/authMiddleware');

// Add a new account
router.route('/').post(protect, admin, createAccount);

// Add multiple accounts at once
router.route('/bulk').post(protect, admin, createBulkAccounts);

// Get accounts by product
router.route('/product/:id').get(protect, admin, getAccountsByProduct);

// Update and delete account
router.route('/:id')
	.put(protect, admin, updateAccount)
	.delete(protect, admin, deleteAccount);

module.exports = router;
