const mongoose = require('mongoose');

const voucherSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        minOrderValue: {
            type: Number,
            default: 0
        },
        maxDiscountAmount: {
            type: Number,
            default: 0
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;