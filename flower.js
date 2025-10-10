// --- Logic nhận diện 3 lần chạm/click liên tiếp ---
// File này chỉ cần thiết nếu bạn muốn thêm một cách chuyển trang bí mật
// Ngoài nút "Tiếp tục"
let tapCount = 0;
let tapTimer = null;
const requiredTaps = 3;

/**
 * Xử lý sự kiện chạm/click.
 * Nếu phát hiện 3 lần chạm liên tiếp trong vòng 500ms, chuyển trang.
 */
function handleTap() {
    tapCount++;

    // Xóa bộ đếm thời gian cũ
    clearTimeout(tapTimer);

    if (tapCount >= requiredTaps) {
        console.log("3 lần chạm/nhấn được phát hiện! Chuyển trang...");
        
        // Gọi hàm navigate() được định nghĩa trong main.js
        if (typeof navigate === 'function') {
            navigate('door.html');
        } else {
            // Fallback nếu main.js chưa tải kịp
            window.location.href = 'door.html';
        }
        
        tapCount = 0; // Đặt lại bộ đếm sau khi thành công
    } else {
        // Bắt đầu bộ đếm thời gian: nếu không có chạm tiếp theo trong 500ms, đếm lại từ đầu
        tapTimer = setTimeout(() => {
            tapCount = 0;
            console.log("Bộ đếm chạm/nhấn được đặt lại.");
        }, 500);
    }
}

// --- Hàm khởi tạo ban đầu ---
window.onload = () => {
    // Logic: Bắt đầu animation hoa sau 1 giây
    const animationDelay = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(animationDelay);
    }, 1000);

    // Thêm sự kiện click/touch cho trang hoa (nếu muốn tính năng chạm bí mật)
    document.body.addEventListener('click', handleTap);
    document.body.addEventListener('touchstart', handleTap);
};
