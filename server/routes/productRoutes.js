const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	uploadProductImage,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer configuration for file upload
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}${path.extname(file.originalname)}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: function (req, file, cb) {
		const fileTypes = /jpeg|jpg|png|gif|webp/;
		const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = fileTypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error('Only image files are supported!'));
		}
	},
});

// Route for image upload
router.post('/upload', protect, admin, upload.single('image'), uploadProductImage);

// Get all products and create new product
router.route('/')
	.get(getProducts)
	.post(protect, admin, createProduct);

// Get, update, and delete product by ID
router.route('/:id')
	.get(getProductById)
	.put(protect, admin, updateProduct)
	.delete(protect, admin, deleteProduct);

module.exports = router;
