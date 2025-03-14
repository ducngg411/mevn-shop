const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                accounts: [
                    {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Account',
                    }
                ]
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        voucher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voucher',
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        finalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
        {
            imestamps: true,
        }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;