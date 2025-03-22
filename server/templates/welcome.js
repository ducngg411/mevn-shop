const welcomeTemplate = (userData) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to MEVN Shop</title>
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
                .footer { 
                    margin-top: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #888;
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
                    <h1>Welcome to MEVN Shop!</h1>
                </div>
                <div class="content">
                    <p>Hello ${userData.fullName || userData.username},</p>
                    <p>Thank you for registering with MEVN Shop! We're excited to have you as a member of our community.</p>
                    <p>With your account, you can:</p>
                    <ul>
                        <li>Browse and purchase premium accounts for various services</li>
                        <li>Track your order history</li>
                        <li>Manage your profile information</li>
                        <li>Receive exclusive discounts and offers</li>
                    </ul>
                    <p>To start shopping, click the button below:</p>
                    <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping</a>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                    <p>Best regards,<br>The MEVN Shop Team</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} MEVN Shop. All rights reserved.</p>
                    <p>123 ABC Street, XYZ District, Ho Chi Minh City</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = welcomeTemplate;