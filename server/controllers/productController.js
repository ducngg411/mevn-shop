const Product = require('../models/Product');
const Account = require('../models/Account');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 10;
        const page = Number(req.query.pageNumber) || 1;
        
        // Xây dựng điều kiện tìm kiếm
        const keyword = req.query.keyword
            ? { title: { $regex: req.query.keyword, $options: 'i' } }
            : {};
        
        const category = req.query.category ? { category: req.query.category } : {};
        
        // Xử lý lọc theo giá
        let priceFilter = {};
        if (req.query.minPrice && req.query.maxPrice) {
            priceFilter = {
                $or: [
                    // Kiểm tra giá gốc
                    { 
                        price: { 
                            $gte: Number(req.query.minPrice), 
                            $lte: Number(req.query.maxPrice) 
                        } 
                    },
                    // Kiểm tra giá khuyến mãi nếu có
                    { 
                        discountPrice: { 
                            $gt: 0, 
                            $gte: Number(req.query.minPrice), 
                            $lte: Number(req.query.maxPrice) 
                        } 
                    }
                ]
            };
        } else if (req.query.minPrice) {
            priceFilter = {
                $or: [
                    { price: { $gte: Number(req.query.minPrice) } },
                    { discountPrice: { $gt: 0, $gte: Number(req.query.minPrice) } }
                ]
            };
        }

        const searchConditions = { ...keyword, ...category, ...priceFilter };
        
        const count = await Product.countDocuments(searchConditions);
        
        let sortOptions = {};
        if (req.query.sortBy) {
            const [field, direction] = req.query.sortBy.split('_');
            sortOptions[field] = direction === 'asc' ? 1 : -1;
        } else {
            sortOptions = { createdAt: -1 }; // Mặc định sắp xếp theo thời gian tạo giảm dần
        }
        
        const products = await Product.find(searchConditions)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort(sortOptions);

        const productsWithStock = await Promise.all(products.map(async product => {
            const availableAccounts = await Account.countDocuments({
                    product: product._id,
                    status: 'available'
                });
                
                return {
                    ...product._doc,
                    availableStock: availableAccounts
                };
            }));
        
        res.json({
            success: true,
            products: productsWithStock,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
        // Calculate the number of available accounts
        const availableAccounts = await Account.countDocuments({
            product: product._id,
            status: 'available'
        });
        
        const productData = {
            ...product._doc,
            availableStock: availableAccounts
        };
        
        res.json({
            success: true,
            product: productData,
        });
        } else {
            res.status(404).json({
                success: false,
                message: 'Product not found',
        });
        }
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

// @desc    Add a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { title, description, price, discountPrice, category, image, stock } = req.body;
        
        const product = await Product.create({
            title,
            description,
            price,
            discountPrice,
            category,
            image,
            stock
        });
        
        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            discountPrice,
            category,
            image,
            stock
        } = req.body;
        
        const product = await Product.findById(req.params.id);
        
        if (product) {
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.category = category || product.category;
            product.image = image || product.image;
            product.stock = stock || product.stock;
        
            const updatedProduct = await product.save();
            res.json({
                success: true,
                product: updatedProduct,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
        // Check and delete associated accounts
        await Account.deleteMany({ product: product._id });
        
        await product.remove();
        res.json({
            success: true,
            message: 'Product has been deleted',
        });
        } else {
        res.status(404).json({
            success: false,
            message: 'Product not found',
        });
        }
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
        });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            imageUrl,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};
