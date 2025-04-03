const resetPasswordTemplate = (user, resetToken) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
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
                .reset-code {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    letter-spacing: 5px;
                }
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
                .warning {
                    background-color: #fff3cd;
                    color: #856404;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Hello ${user.fullName || user.username},</p>
                    <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                    <p>To reset your password, use the following verification code:</p>
                    
                    <div class="reset-code">${resetToken}</div>
                    
                    <p>Alternatively, you can click the button below to reset your password:</p>
                    <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}/reset-password?token=${resetToken}&email=${user.email}" class="button">Reset Password</a>
                    
                    <div class="warning">
                        <p><strong>Important:</strong> This code will expire in 60 minutes for security reasons.</p>
                    </div>
                    
                    <p>If you're having trouble, please contact our support team for assistance.</p>
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

module.exports = resetPasswordTemplate;