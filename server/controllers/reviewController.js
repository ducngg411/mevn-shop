const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
	try {
		const { product, rating, comment } = req.body;

		// Check if the user has purchased the product
		const hasPurchased = await Order.findOne({
			user: req.user._id,
			'orderItems.product': product,
			status: { $in: ['completed', 'pending'] } // Allow review for both pending and completed orders
		});

		if (!hasPurchased) {
			return res.status(400).json({
				success: false,
				message: 'You can only review products that you have purchased',
			});
		}

		// Check if the user has already reviewed this product
		const alreadyReviewed = await Review.findOne({
			user: req.user._id,
			product,
		});

		if (alreadyReviewed) {
			return res.status(400).json({
				success: false,
				message: 'You have already reviewed this product',
			});
		}

		// Create a new review
		const review = await Review.create({
			user: req.user._id,
			product,
			rating: Number(rating),
			comment,
		});

		// Populate user information in the review
		const populatedReview = await Review.findById(review._id).populate('user', 'username fullName');

		res.status(201).json({
			success: true,
			review: populatedReview,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = async (req, res) => {
try {
    const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'username fullName')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        reviews,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
try {
    const review = await Review.findById(req.params.id);

    if (!review) {
    return res.status(404).json({
        success: false,
        message: 'Review not found',
    });
    }

    // Check if user has permission to delete the review
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this review',
    });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: 'Review has been deleted',
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

module.exports = {
    createReview,
    getProductReviews,
    deleteReview,
};