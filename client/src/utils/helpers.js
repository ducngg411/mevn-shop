export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    }).format(value)
}

export const formatDate = (value) => {
    if (!value) return ''
    const date = new Date(value)
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

export const getOrderStatusText = (status) => {
    const statusMap = {
        pending: 'Waiting for payment',
        completed: 'Completed',
        canceled: 'Canceled',
    }
    return statusMap[status] || status
}

export const getPaymentMethodText = (method) => {
    const methodMap = {
        'Credit Card': 'Credit Card',
    }
    return methodMap[method] || method
}

export const truncateText = (text, length = 100) => {
    if (!text) return ''
    return text.length > length 
        ? text.substring(0, length) + '...'
        : text
}

export const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://picsum.photos/300/200';

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';
    const baseURL = apiUrl.replace(/\/api$/, '');
    
    if (imageUrl.startsWith('/uploads')) {
        return baseURL + imageUrl;
    }

    if (!imageUrl.startsWith('/')) {
        if (imageUrl.startsWith('uploads')) {
            return `${baseURL}/${imageUrl}`;
        } else {
            return `${baseURL}/uploads/${imageUrl}`
        }
    }
    return `${baseURL}${imageUrl}`;
}