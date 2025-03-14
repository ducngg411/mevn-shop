const express = require('express');
const router = express.Router();

const {
    createReview,
    getProductReviews,
    deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

// Create a review

router.route('/')
    .post(protect, createReview);

// Get all reviews for a product

router.route('/product/:id')
    .get(getProductReviews);

// Delete a review

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;