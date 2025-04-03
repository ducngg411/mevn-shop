// Function định dạng tiền tệ cho backend
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    }).format(value);
};
    
    const orderConfirmationTemplate = (order, user) => {
        let orderItemsHTML = '';
        
        order.orderItems.forEach(item => {
        orderItemsHTML += `
            <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product.title || item.productTitle}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
            </tr>
        `;
        });
        
        let accountsHTML = '';
        
        if (order.status === 'completed' && order.paymentStatus === 'completed') {
        order.orderItems.forEach((item, itemIndex) => {
            if (item.accounts && item.accounts.length > 0) {
            accountsHTML += `
                <h3>${item.product ? item.product.title : item.productTitle}</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <th style="padding: 10px; background-color: #f2f2f2; text-align: left; border: 1px solid #ddd;">Username</th>
                    <th style="padding: 10px; background-color: #f2f2f2; text-align: left; border: 1px solid #ddd;">Password</th>
                    <th style="padding: 10px; background-color: #f2f2f2; text-align: left; border: 1px solid #ddd;">Additional Info</th>
                </tr>
            `;
            
            item.accounts.forEach((account, accIndex) => {
                accountsHTML += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${account.username}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${account.password}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${account.additionalInfo || 'N/A'}</td>
                </tr>
                `;
            });
            
            accountsHTML += `</table>`;
            }
        });
        } else {
        accountsHTML = `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Note:</strong> Account details will be available once payment is confirmed.</p>
            </div>
        `;
        }
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
            <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333;
                max-width: 600px;
                margin: 0 auto;
            }
            .container { padding: 20px; }
            .header { 
                background-color: #3498db; 
                padding: 20px;
                color: white;
                text-align: center;
            }
            .content { padding: 20px; }
            .order-info {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 20px;
            }
            .order-table {
                width: 100%;
                border-collapse: collapse;
            }
            .order-table th {
                background-color: #f2f2f2;
                padding: 10px;
                text-align: left;
                border-bottom: 2px solid #ddd;
            }
            .order-summary {
                margin-top: 20px;
                text-align: right;
            }
            .footer { 
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #888;
            }
            .status-badge {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-completed {
                background-color: #2ecc71;
                color: white;
            }
            .status-pending {
                background-color: #f39c12;
                color: white;
            }
            .button {
                display: inline-block;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <p>Hello ${user.fullName || user.username},</p>
                <p>Thank you for your order! Here are your order details:</p>
                
                <div class="order-info">
                <p><strong>Order ID:</strong> #${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p>
                    <strong>Status:</strong> 
                    <span class="status-badge ${order.status === 'completed' ? 'status-completed' : 'status-pending'}">
                    ${order.status === 'completed' ? 'Completed' : 'Pending Payment'}
                    </span>
                </p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                </div>
                
                <h3>Ordered Items</h3>
                <table class="order-table">
                <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
                ${orderItemsHTML}
                </table>
                
                <div class="order-summary">
                <p><strong>Subtotal:</strong> ${formatCurrency(order.totalAmount)}</p>
                ${order.discountAmount > 0 ? `<p><strong>Discount:</strong> -${formatCurrency(order.discountAmount)}</p>` : ''}
                <p style="font-size: 18px;"><strong>Total:</strong> ${formatCurrency(order.finalAmount)}</p>
                </div>
                
                <h3>Account Information</h3>
                ${accountsHTML}
                
                <p>You can view your order details anytime by visiting your account page:</p>
                <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}/orders/${order._id}" class="button">View Order</a>
                
                <p>If you have any questions or need assistance, please contact our support team.</p>
                <p>Thank you for shopping with us!</p>
                <p>Best regards,<br>License Zone - Premium Store</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} License Zone@ All rights reserved.</p>
                <p>Greenwich VietNam, 2 Pham Van Bach, Cau Giay, Ha Noi</p>
            </div>
            </div>
        </body>
        </html>
        `;
};

module.exports = orderConfirmationTemplate;