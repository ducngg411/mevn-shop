const Voucher = require('../models/Voucher');

// @desc    Create new voucher
// @route   POST /api/vouchers
// @access  Private/Admin
const createVoucher = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            isActive,
            usageLimit,
        } = req.body;

        // Check if code already exists
        const existingVoucher = await Voucher.findOne({ code });
        if (existingVoucher) {
            return res.status(400).json({
                success: false,
                message: 'Voucher code already exists',
            });
        }

        const voucher = await Voucher.create({
            code,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            isActive,
            usageLimit,
            timeUsed: 0
        });

        res.status(201).json({
            success: true,
            voucher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all vouchers
// @route   GET /api/vouchers
// @access  Private/Admin
const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find({}).sort({ createdAt: -1 });

        res.json({
            success: true,
            vouchers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get voucher by ID
// @route   GET /api/vouchers/:id
// @access  Private/Admin
const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (voucher) {
            res.json({
                success: true,
                voucher,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Voucher not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Validate voucher
// @route   POST /api/vouchers/validate
// @access  Private
const validateVoucher = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;

        const voucher = await Voucher.findOne({
            code,
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher does not exist or has expired',
            });
        }

        if (
            voucher.usageLimit !== null && 
            voucher.timesUsed >= voucher.usageLimit
        ) {
            return res.status(400).json({
                success: false,
                message: 'Voucher has reached its maximum number of uses',
            });
        }


        if (totalAmount < voucher.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Order must be at least ${voucher.minOrderValue.toLocaleString()} to use this voucher`,
            });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (voucher.discountType === 'percentage') {
            discountAmount = (totalAmount * voucher.discountValue) / 100;
            if (voucher.maxDiscountAmount > 0 && discountAmount > voucher.maxDiscountAmount) {
                discountAmount = voucher.maxDiscountAmount;
            }
        } else {
            discountAmount = voucher.discountValue;
        }

        res.json({
            success: true,
            voucher: {
                ...voucher.toObject(),
                canBeUsed: voucher.usageLimit === null || voucher.timesUsed < voucher.usageLimit
            },
            discountAmount,
            finalAmount: totalAmount - discountAmount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update voucher
// @route   PUT /api/vouchers/:id
// @access  Private/Admin
const updateVoucher = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            isActive,
            usageLimit
        } = req.body;

        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher not found',
            });
        }

        // Check if code already exists (if code is changed)
        if (code !== voucher.code) {
            const existingVoucher = await Voucher.findOne({ code });
            if (existingVoucher) {
                return res.status(400).json({
                    success: false,
                    message: 'Voucher code already exists',
                });
            }
        }

        voucher.code = code || voucher.code;
        voucher.discountType = discountType || voucher.discountType;
        voucher.discountValue = discountValue || voucher.discountValue;
        voucher.minOrderValue = minOrderValue || voucher.minOrderValue;
        voucher.maxDiscountAmount = maxDiscountAmount || voucher.maxDiscountAmount;
        voucher.startDate = startDate || voucher.startDate;
        voucher.endDate = endDate || voucher.endDate;
        voucher.isActive = isActive !== undefined ? isActive : voucher.isActive;
        voucher.usageLimit = usageLimit !== undefined ? usageLimit : voucher.usageLimit;

        const updatedVoucher = await voucher.save();

        res.json({
            success: true,
            voucher: updatedVoucher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const applyVoucherToOrder = async (voucher, order) => {
    // Increment the timesUsed for the voucher
    if (voucher) {
        voucher.timesUsed += 1;
        await voucher.save();
    }
};

// @desc    Delete voucher
// @route   DELETE /api/vouchers/:id
// @access  Private/Admin
const deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher not found',
            });
        }

        await Voucher.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Voucher has been deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createVoucher,
    getVouchers,
    getVoucherById,
    validateVoucher,
    updateVoucher,
    deleteVoucher,
    applyVoucherToOrder
};
