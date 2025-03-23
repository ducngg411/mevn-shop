const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const initOrderScheduler = require('./utils/orderScheduler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const accountRoutes = require('./routes/accountRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supportRoutes = require('./routes/supportRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use('/api/payments/webhook', express.raw({type: 'application/json'}));

app.use(express.json());

app.use('/api/support', supportRoutes);

// Create 'uploads' directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads');
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/payments', paymentRoutes);

// Default route
app.get('/', (req, res) => {
	res.send('API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		success: false,
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
});

initOrderScheduler();

// Port and server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
