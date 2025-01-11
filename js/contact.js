// Animation khi scroll
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.contact-info, .contact-form, .map-section').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Form handling với animation
document.querySelector('.contact-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Animation khi submit
    const btn = e.target.querySelector('.btn');
    btn.innerHTML = '<span class="spinner"></span> Đang gửi...';
    
    // Giả lập gửi form
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Hiển thị thông báo thành công
    toastr.success('Tin nhắn của bạn đã được gửi thành công!');
    
    // Reset form
    e.target.reset();
    btn.innerHTML = 'Gửi';
});

// Thêm hiệu ứng hover cho các input
document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
}); 
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});