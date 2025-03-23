const supportRequestTemplate = (formData) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>New Support Request</title>
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
                .message-details {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }
                .field-name {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Support Request</h1>
                </div>
                <div class="content">
                    <p>A new support request has been submitted through the website:</p>
                    
                    <div class="message-details">
                        <p><span class="field-name">From:</span> ${formData.name} (${formData.email})</p>
                        <p><span class="field-name">Subject:</span> ${formData.subject}</p>
                        ${formData.orderNumber ? `<p><span class="field-name">Order Number:</span> ${formData.orderNumber}</p>` : ''}
                        <p><span class="field-name">Message:</span></p>
                        <p>${formData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <p>Please respond to this customer as soon as possible.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} MEVN Shop. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = supportRequestTemplate;