const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

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
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.email = req.body.email || user.email;
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();
            res.json({
                success: true,
                user: updatedUser
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.remove();
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// @desc    Get all orders from user
// @route   GET /api/users/:id/orders
// @access  Private/Admin

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id }).populate('user', 'id username email fullName phone address role').populate({
            orderItems: 'product quantity price'
        });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders
}