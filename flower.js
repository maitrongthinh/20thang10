// --- LOGIC GỐC: Logic nhận diện 3 lần chạm/click liên tiếp (Tính năng bí mật) ---
let tapCount = 0;
let tapTimer = null;
const requiredTaps = 3;

/**
 * Xử lý sự kiện chạm/click.
 */
function handleTap(event) {
    // Ngăn không cho sự kiện chạy khi bấm vào các nút có sẵn
    if (event.target.id === 'continue-button-flower') {
        return; 
    }
    
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= requiredTaps) {
        console.log("3 lần chạm/nhấn được phát hiện! Chuyển trang...");
        
        // Gọi hàm navigate() được định nghĩa trong main.js
        if (typeof navigate === 'function') {
            navigate('door.html');
        } else {
            // Fallback
            window.location.href = 'door.html';
        }
        
        tapCount = 0; // Đặt lại bộ đếm sau khi thành công
    } else {
        tapTimer = setTimeout(() => {
            tapCount = 0;
            console.log("Bộ đếm chạm/nhấn được đặt lại.");
        }, 500);
    }
}

// ----------------------------------------------------------------------
// --- LOGIC MỚI: TẠO VÀ DI CHUYỂN ĐOM ĐÓM (FIREFLIES) ---
// ----------------------------------------------------------------------

const NUM_FIREFLIES = 20; 
let fireflyContainer; 

function createFirefly() {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    firefly.style.left = `${x}px`;
    firefly.style.top = `${y}px`;
    
    const duration = 15 + Math.random() * 10; 
    
    firefly.style.transition = `all ${duration}s linear`;
    firefly.style.transform = 'translate(0, 0)';

    fireflyContainer.appendChild(firefly);
    
    setTimeout(() => {
        animateFirefly(firefly, duration);
    }, 100 + Math.random() * 1000); 
}

function animateFirefly(firefly, duration) {
    const dx = (Math.random() - 0.5) * 1000; 
    const dy = (Math.random() - 0.5) * 1000; 
    const opacity = 0.5 + Math.random() * 0.5;

    firefly.style.transition = `all ${duration}s linear`;
    firefly.style.transform = `translate(${dx}px, ${dy}px) scale(${0.8 + Math.random() * 0.4})`;
    firefly.style.opacity = opacity;

    setTimeout(() => {
        animateFirefly(firefly, duration);
    }, duration * 1000); 
}

function initFireflies() {
    fireflyContainer = document.getElementById('firefly-container');

    if (fireflyContainer) {
        for (let i = 0; i < NUM_FIREFLIES; i++) {
            createFirefly();
        }
    }
}

// ----------------------------------------------------------------------
// --- CODE MỚI: THÔNG BÁO TÍNH NĂNG BÍ MẬT ---
// ----------------------------------------------------------------------

/**
 * Thêm một dòng thông báo nhỏ về tính năng bí mật ở góc dưới phải màn hình.
 */
function addSecretTip() {
    const tip = document.createElement('div');
    tip.id = 'secret-tip';
    // Đặt nội dung theo yêu cầu của bạn
    tip.innerHTML = '🤫 Gõ 3 lần để đi tiếp...';
    document.body.appendChild(tip);
}

// ----------------------------------------------------------------------
// --- KHỞI TẠO CHUNG: GẮN MỌI THỨ VÀO DOMContentLoaded ---
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic gốc của bạn: Bắt đầu animation hoa sau 1 giây
    const animationDelay = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(animationDelay);
    }, 1000);

    // 2. Khởi tạo đom đóm
    initFireflies();

    // 3. Thêm thông báo bí mật
    addSecretTip();
    
    // 4. GẮN SỰ KIỆN TÍNH NĂNG BÍ MẬT VÀO TOÀN BỘ DOCUMENT
    document.addEventListener('click', handleTap);
    document.addEventListener('touchstart', handleTap);
});