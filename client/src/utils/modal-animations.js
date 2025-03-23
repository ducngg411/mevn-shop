document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close') || 
        event.target.parentElement.classList.contains('close')) {
        
        const modalOverlay = event.target.closest('.modal-overlay');
        if (modalOverlay) {
            // Add closing class to trigger animation
            modalOverlay.classList.add('closing');
            
            // Wait for animation to complete before actually closing the modal
            setTimeout(() => {
                // Here Vue will handle hiding the modal through v-if or v-show
                // But we need to remove the 'closing' class for correct display next time
                modalOverlay.classList.remove('closing');
            }, 300); // 300ms is the animation duration
        }
    }
});

// Add effect when modal first appears
document.addEventListener('DOMNodeInserted', function(event) {
    if (event.target.classList && event.target.classList.contains('modal-overlay')) {
        // Ensure modal is displayed in center of screen
        event.target.style.display = 'flex';
        event.target.style.alignItems = 'center';
        event.target.style.justifyContent = 'center';
        
        // Add appearance effect
        const modalDialog = event.target.querySelector('.modal-dialog');
        if (modalDialog) {
            // Reset transform for proper animation
            modalDialog.style.transform = 'translateY(30px)';
            setTimeout(() => {
                modalDialog.style.transform = 'translateY(0)';
            }, 10);
        }
    }
});