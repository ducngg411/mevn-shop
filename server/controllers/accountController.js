const Account = require('../models/Account');
const Product = require('../models/Product');

// @desc    Add account for a product
// @route   POST /api/accounts
// @access  Private/Admin
const createAccount = async (req, res) => {
	try {
		const { product, username, password, additionalInfo } = req.body;

		// Check if product exists
		const productExists = await Product.findById(product);
		if (!productExists) {
			return res.status(404).json({
				success: false,
				message: 'Product does not exist',
			});
		}

		const account = await Account.create({
			product,
			username,
			password,
			additionalInfo,
		});

		// Update stock quantity on the product
		productExists.stock += 1;
		await productExists.save();

		res.status(201).json({
			success: true,
			account,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Add multiple accounts at once
// @route   POST /api/accounts/bulk
// @access  Private/Admin
const createBulkAccounts = async (req, res) => {
	try {
		const { product, accounts } = req.body;

		// Check if product exists
		const productExists = await Product.findById(product);
		if (!productExists) {
			return res.status(404).json({
				success: false,
				message: 'Product does not exist',
			});
		}

		// Check if accounts is an array
		if (!Array.isArray(accounts) || accounts.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid account list',
			});
		}

		// Create list of accounts to insert
		const accountsToInsert = accounts.map(acc => ({
			product,
			username: acc.username,
			password: acc.password,
			additionalInfo: acc.additionalInfo || '',
			status: 'available',
		}));

		const insertedAccounts = await Account.insertMany(accountsToInsert);

		// Update stock quantity on the product
		productExists.stock += insertedAccounts.length;
		await productExists.save();

		res.status(201).json({
			success: true,
			message: `Added ${insertedAccounts.length} accounts`,
			count: insertedAccounts.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private/Admin

const getAccounts = async (req, res) => {
	try {
		const accounts = await Account.find({}).sort({ createdAt: -1 });

		res.json({
			success: true,
			accounts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// @desc    Get all accounts for a product (admin)
// @route   GET /api/accounts/product/:id
// @access  Private/Admin
const getAccountsByProduct = async (req, res) => {
	try {
		const accounts = await Account.find({
			product: req.params.id,
		}).sort({ createdAt: -1 });

		res.json({
			success: true,
			accounts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update account information
// @route   PUT /api/accounts/:id
// @access  Private/Admin
const updateAccount = async (req, res) => {
	try {
		const { username, password, additionalInfo, status } = req.body;

		const account = await Account.findById(req.params.id);

		if (!account) {
			return res.status(404).json({
				success: false,
				message: 'Account not found',
			});
		}

		account.username = username || account.username;
		account.password = password || account.password;
		account.additionalInfo = additionalInfo || account.additionalInfo;

		// If status changes, update product quantity
		if (status && status !== account.status) {
			const product = await Product.findById(account.product);

			if (product) {
				if (status === 'sold' && account.status === 'available') {
					product.sold += 1;
				} else if (status === 'available' && account.status === 'sold') {
					product.sold = Math.max(0, product.sold - 1);
				}
				await product.save();
			}

			account.status = status;
		}

		const updatedAccount = await account.save();

		res.json({
			success: true,
			account: updatedAccount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private/Admin
const deleteAccount = async (req, res) => {
	try {
		const account = await Account.findById(req.params.id);

		if (!account) {
			return res.status(404).json({
				success: false,
				message: 'Account not found',
			});
		}

		// Update stock quantity on product if account is available
		if (account.status === 'available') {
			const product = await Product.findById(account.product);
			if (product) {
				product.stock = Math.max(0, product.stock - 1);
				await product.save();
			}
		}

		await account.remove();

		res.json({
			success: true,
			message: 'Account has been deleted',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	createAccount,
	createBulkAccounts,
	getAccountsByProduct,
	updateAccount,
	deleteAccount,
	getAccounts
};
