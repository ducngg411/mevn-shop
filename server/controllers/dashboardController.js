const Order = require('../models/Order');
const Product = require('../models/Product');
const Account = require('../models/Account');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const currentDate = new Date();
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(currentDate.getDate() - 60);
        
        const totalOrders = await Order.countDocuments();
        
        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const previousOrders = await Order.countDocuments({
            createdAt: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo 
            }
        });
        
        let orderGrowth = 0;
        if (previousOrders > 0) {
            orderGrowth = ((recentOrders - previousOrders) / previousOrders) * 100;
        }
        
        const ordersForRevenue = await Order.find({
            status: 'completed'
        });
        
        let totalRevenue = 0;
        ordersForRevenue.forEach(order => {
            totalRevenue += order.finalAmount;
        });
        
        const recentRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$finalAmount' }
                }
            }
        ]);
        
        const previousRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { 
                        $gte: sixtyDaysAgo,
                        $lt: thirtyDaysAgo 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$finalAmount' }
                }
            }
        ]);
        
        let revenueGrowth = 0;
        const recent = recentRevenue.length > 0 ? recentRevenue[0].total : 0;
        const previous = previousRevenue.length > 0 ? previousRevenue[0].total : 0;
        
        if (previous > 0) {
            revenueGrowth = ((recent - previous) / previous) * 100;
        }
        
        const totalProducts = await Product.countDocuments();
        
        const availableAccounts = await Account.countDocuments({ status: 'available' });
        
        const totalUsers = await User.countDocuments({ role: 'customer' });
        
        const recentUsers = await User.countDocuments({
            role: 'customer',
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const previousUsers = await User.countDocuments({
            role: 'customer',
            createdAt: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo 
            }
        });
        
        let userGrowth = 0;
        if (previousUsers > 0) {
            userGrowth = ((recentUsers - previousUsers) / previousUsers) * 100;
        }

        const recentOrdersList = await Order.find()
            .populate('user', 'username fullName email')
            .sort({ createdAt: -1 })
            .limit(5);
            
        const lowStockProducts = await Product.aggregate([
            {
                $lookup: {
                    from: 'accounts',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'accounts'
                }
            },
            {
                $addFields: {
                    availableAccounts: {
                        $size: {
                            $filter: {
                                input: '$accounts',
                                as: 'account',
                                cond: { $eq: ['$$account.status', 'available'] }
                            }
                        }
                    }
                }
            },
            {
                $match: { availableAccounts: { $lt: 5 } }
            },
            {
                $sort: { availableAccounts: 1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    image: 1,
                    price: 1,
                    discountPrice: 1,
                    availableAccounts: 1
                }
            }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalOrders,
                orderGrowth: parseFloat(orderGrowth.toFixed(1)),
                totalRevenue,
                revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
                totalProducts,
                availableAccounts,
                totalUsers,
                userGrowth: parseFloat(userGrowth.toFixed(1)),
                recentOrders: recentOrdersList,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};