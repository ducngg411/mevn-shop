const User = require('../models/User');
const Order = require('../models/Order'); 

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (user) {
            res.json({
                success: true,
                user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.role = req.body.role || user.role;
            
            if (req.body.password) {
                user.password = req.body.password;
            }
            
            const updatedUser = await user.save();
            
            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    fullName: updatedUser.fullName,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    role: updatedUser.role
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (user) {
            // Don't allow deletion of admin users
            if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete another admin user'
                });
            }
            
            await User.deleteOne({ _id: user._id });
            
            res.json({
                success: true,
                message: 'User removed'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get orders for a specific user
// @route   GET /api/users/:id/orders
// @access  Private/Admin
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'title price image');
        
        if (orders) {
            res.json({
                success: true,
                orders
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No orders found for this user'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders
};