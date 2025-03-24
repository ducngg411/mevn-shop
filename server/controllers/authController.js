const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

const registerUser = async (req, res) => {
    try {
        const { username, email, password, fullName, phone, address } = req.body;

        const userExists = await User.findOne({ $or : [{ email }, { username }] });

        if (userExists) {
            res.status(400).json(
                {   
                    success: false,
                    message: 'Username or email already exists'
                }
            );
        }

        const user = await User.create({
            username,
            email,
            password,
            fullName,
            phone,
            address
        });

        if (user) {
            try {
                await sendWelcomeEmail(user);
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
            }

            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid user data'
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        await sendPasswordResetEmail(user, resetToken);

        res.json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        
        console.log('Received reset request:', { email, token });
        
        const userExists = await User.findOne({ email });
        if (!userExists) {
            console.log('User not found with email:', email);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        console.log('Found user:', {
            email: userExists.email,
            storedToken: userExists.resetPasswordToken,
            tokenMatches: userExists.resetPasswordToken === token,
            tokenExpiry: userExists.resetPasswordExpires,
            isExpired: userExists.resetPasswordExpires < Date.now(),
            currentTime: new Date()
        });

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        // Check username and password

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                }
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
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.email = req.body.email || user.email;
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

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
                    role: updatedUser.role,
                    token: generateToken(updatedUser._id)
                }
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
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const isMatch = await user.matchPassword(currentPassword);
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    changePassword,
};