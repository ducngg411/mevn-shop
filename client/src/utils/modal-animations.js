// Lắng nghe sự kiện click trên nút đóng modal
document.addEventListener('click', function(event) {
    // Kiểm tra xem phần tử được click có class 'close' không
    if (event.target.classList.contains('close') || 
        event.target.parentElement.classList.contains('close')) {
      
      // Tìm phần tử modal-overlay gần nhất
      const modalOverlay = event.target.closest('.modal-overlay');
      if (modalOverlay) {
        // Thêm class closing để kích hoạt animation
        modalOverlay.classList.add('closing');
        
        // Đợi animation hoàn thành rồi mới thực sự đóng modal
        setTimeout(() => {
          // Ở đây Vue sẽ xử lý việc ẩn modal thông qua v-if hoặc v-show
          // Nhưng chúng ta cần xóa class 'closing' để lần sau hiển thị đúng
          modalOverlay.classList.remove('closing');
        }, 300); // 300ms là thời gian của animation
      }
    }
  });
  
  // Thêm hiệu ứng khi modal mới xuất hiện
  document.addEventListener('DOMNodeInserted', function(event) {
    if (event.target.classList && event.target.classList.contains('modal-overlay')) {
      // Đảm bảo rằng modal hiển thị ở giữa màn hình
      event.target.style.display = 'flex';
      event.target.style.alignItems = 'center';
      event.target.style.justifyContent = 'center';
      
      // Thêm hiệu ứng xuất hiện
      const modalDialog = event.target.querySelector('.modal-dialog');
      if (modalDialog) {
        // Reset transform để animation chạy đúng
        modalDialog.style.transform = 'translateY(30px)';
        setTimeout(() => {
          modalDialog.style.transform = 'translateY(0)';
        }, 10);
      }
    }
  });