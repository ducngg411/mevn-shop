const mongoose = require('mongoose');

const accountSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        additionalInfo: {
            type: String,
        },
        status: {
            type: String,
            enum: ['available', 'sold'],
            default: 'available'
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
    