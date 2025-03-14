const Order = require('../models/Order');
const Product = require('../models/Product');
const Account = require('../models/Account');
const Voucher = require('../models/Voucher');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
	try {
		const { orderItems, paymentMethod = 'Credit Card', voucher } = req.body;

		if (!orderItems || orderItems.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'No products in the order',
			});
		}

		// Process each product in the order
		let totalAmount = 0;
		const processedItems = [];

		for (const item of orderItems) {
			const product = await Product.findById(item.product);

			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product not found with ID: ${item.product}`,
				});
			}

			// Check if enough accounts are available
			const availableAccounts = await Account.find({
				product: product._id,
				status: 'available',
			}).limit(item.quantity);

			if (availableAccounts.length < item.quantity) {
				return res.status(400).json({
					success: false,
					message: `Product "${product.title}" only has ${availableAccounts.length} available accounts, not enough for the requested quantity (${item.quantity})`,
				});
			}

			// Use discounted price if available, otherwise use the original price
			const price = product.discountPrice > 0 ? product.discountPrice : product.price;

			const accountIds = availableAccounts.map(acc => acc._id);

			processedItems.push({
				product: product._id,
                productTitle: product.title,
				quantity: item.quantity,
				price,
				accounts: accountIds,
			});

			totalAmount += price * item.quantity;
		}

		// Apply voucher if provided
		let discountAmount = 0;
		let finalAmount = totalAmount;
		let voucherData = null;

		if (voucher) {
			voucherData = await Voucher.findOne({
				code: voucher,
				isActive: true,
				startDate: { $lte: new Date() },
				endDate: { $gte: new Date() },
			});

			if (voucherData) {
				if (totalAmount >= voucherData.minOrderValue) {
					if (voucherData.discountType === 'percentage') {
						discountAmount = (totalAmount * voucherData.discountValue) / 100;

						// Cap the discount amount if necessary
						if (voucherData.maxDiscountAmount > 0 && discountAmount > voucherData.maxDiscountAmount) {
							discountAmount = voucherData.maxDiscountAmount;
						}
					} else {
						// Fixed discount
						discountAmount = voucherData.discountValue;
					}

					finalAmount = totalAmount - discountAmount;
				}
			}
		}

		// Create the order
		const order = await Order.create({
			user: req.user._id,
			orderItems: processedItems,
			totalAmount,
			voucher: voucherData ? voucherData._id : null,
			discountAmount,
			finalAmount,
			paymentMethod,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date(),
		});

		// Update the status of the accounts
		for (const item of processedItems) {
			for (const accountId of item.accounts) {
				await Account.findByIdAndUpdate(accountId, {
					status: 'sold',
					order: order._id,
				});
			}

			// Update the sold quantity of the product
			await Product.findByIdAndUpdate(item.product, {
				$inc: { sold: item.quantity },
			});
		}

        // Update stock for products
        for (const item of processedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

		res.status(201).json({
			success: true,
			order,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('user', 'username email fullName')
			.populate('orderItems.product', 'title image price discountPrice');

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found',
			});
		}

		// Check if the current user is the one who placed the order or an admin
		if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({
				success: false,
				message: 'You do not have permission to view this order',
			});
		}

		// If the order is completed or the user is admin, include account details
		if (order.status === 'completed' || req.user.role === 'admin') {
			await order.populate('orderItems.accounts', 'username password additionalInfo');
		} else {
			// If the order is not completed and the user is not an admin, only show account IDs
			for (const item of order.orderItems) {
				item.accounts = item.accounts.map(acc => ({ _id: acc }));
			}
		}

		res.json({
			success: true,
			order,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


// @desc    Get all orders for the current user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate('orderItems.product', 'title image')
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			orders,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate('user', 'username fullName')
			.populate('orderItems.product', 'title')
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			orders,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
	try {
		const { status, paymentStatus } = req.body;
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found',
			});
		}

		// Save old status for comparison
		const oldStatus = order.status;

		// Update new status
		if (status) order.status = status;
		if (paymentStatus) order.paymentStatus = paymentStatus;

		// Save the order
		const updatedOrder = await order.save();

		// If the order changes from any status to completed
		if (status === 'completed' && oldStatus !== 'completed') {
			// Update stock for products
			for (const item of order.orderItems) {
				await Product.findByIdAndUpdate(item.product, {
					$inc: { stock: -item.quantity }
				});
			}
		}

		// If the order changes from completed to cancelled
		if (status === 'cancelled' && oldStatus === 'completed') {
			// Restore stock
			for (const item of order.orderItems) {
				await Product.findByIdAndUpdate(item.product, {
					$inc: { stock: item.quantity }
				});
			}

			// Update account status to available
			for (const item of order.orderItems) {
				for (const accountId of item.accounts) {
					await Account.findByIdAndUpdate(accountId, {
						status: 'available',
						order: null
					});
				}
			}
		}

		res.json({
			success: true,
			order: updatedOrder,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get Remaining Time Before Order Expiration
// @route   GET /api/orders/:id/remaining-time
// @access  Private

const getRemainingTime = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            })
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this order',
            });
        }

        if (order.status !== 'pending') {
            return res.json({
                success: true,
                status: order.status,
                remainingTime: 0,
            });
        }

        const createdAt = new Date(order.createdAt).getTime();
        const expiresAt = createdAt + (15 * 60 * 1000); // 15 minutes
        const now = Date.now();

        const remainingMs = expiresAt - now;
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

        res.json({
            success: true,
            status: order.status,
            remainingTime: `${remainingSeconds}s`,
            expiresAt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
	createOrder,
	getOrderById,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
    getRemainingTime,
};