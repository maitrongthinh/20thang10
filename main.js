// Global variables for Firebase auth (not strictly used for this simple app, but good practice to include)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// --- Audio Management (Sử dụng Audio cơ bản) ---
let softPianoAudio = null;
let doorOpenAudio = null;

/**
 * Initializes and loads audio files.
 * Uses localStorage to persist music playback state across pages.
 */
function initAudio() {
    // Tải nhạc nền piano (Sử dụng URL giả định - CẦN THAY THẾ)
    softPianoAudio = new Audio('assets/soft-piano.mp3'); 
    softPianoAudio.loop = true;
    softPianoAudio.volume = 0.5; // Âm lượng êm dịu

    // Tải âm thanh cửa mở (Sử dụng URL giả định - CẦN THAY THẾ)
    doorOpenAudio = new Audio('assets/door-open.mp3');
    doorOpenAudio.volume = 0.7;

    // Kiểm tra nếu nhạc đã được bật (người dùng đã nhấn Mở Quà)
    if (localStorage.getItem('musicStarted') === 'true') {
        playSoftPiano();
    }
}

/**
 * Cố gắng phát nhạc nền.
 * Sẽ thất bại nếu trình duyệt chặn autoplay, cần tương tác người dùng.
 */
function playSoftPiano() {
    if (softPianoAudio && softPianoAudio.paused) {
        softPianoAudio.play().catch(e => {
            console.log("Autoplay bị chặn. Cần tương tác người dùng.");
            // Xử lý thất bại (ví dụ: hiển thị thông báo)
        });
    }
}

/**
 * Hàm chuyển trang mượt mà
 * @param {string} pageUrl - URL của trang tiếp theo
 */
function navigate(pageUrl) {
    const body = document.body;
    body.classList.add('fade-out');

    // Chuyển trang sau khi hiệu ứng fade-out hoàn tất
    setTimeout(() => {
        window.location.href = pageUrl;
    }, 500); 
}

// --- Logic Trang Bó Hoa (flower.html) ---

/**
 * Hiển thị tin nhắn chúc mừng 20/10 sau khi animation hoa hoàn tất.
 */
function setupFlowerPage() {
    const flowerMessage = document.getElementById('flower-message');
    const continueButtonFlower = document.getElementById('continue-button-flower');
    
    // Nội dung tin nhắn cuối cùng, dành riêng cho các bạn nữ 9A
    const finalMessage = "Chúc các thiên thần 9A mãi rạng rỡ và thành công trên con đường học tập! Mãi là những bông hoa tươi đẹp nhất của lớp nhé! ❤️"; 

    // Đặt nội dung
    flowerMessage.innerHTML = finalMessage;

    // Sau 5 giây (thời gian animation hoa chạy), hiển thị tin nhắn và nút
    setTimeout(() => {
        flowerMessage.classList.add('visible');
    }, 5000); // 5 giây cho hoa nở

    // Sau 7 giây, hiển thị nút tiếp tục
    setTimeout(() => {
        continueButtonFlower.classList.add('visible');
    }, 7000);

    // Gắn sự kiện chuyển trang cho nút Tiếp tục
    if (continueButtonFlower) {
        continueButtonFlower.onclick = () => {
            navigate('door.html');
        };
    }
}


// --- Logic Trang Cánh Cửa (door.html) ---

const countdownElement = document.getElementById('door-message');
const doorButton = document.getElementById('door-button');
const doorWrapper = document.querySelector('.door-wrapper');
let isDoorOpen = false;


/**
 * Logic mở cửa và hiển thị thông báo cuối cùng
 */
function openDoor() {
    if (isDoorOpen) return;
    isDoorOpen = true;

    // Phát âm thanh mở cửa
    if (doorOpenAudio) {
        doorOpenAudio.currentTime = 0;
        doorOpenAudio.play();
    }

    // Mở cửa
    doorWrapper.classList.add('open');

    // Tắt nhạc nền
    if (softPianoAudio) {
        softPianoAudio.pause();
        const audioControl = document.getElementById('audio-control');
        if (audioControl) {
            audioControl.innerHTML = '🔇';
            audioControl.classList.add('paused');
            localStorage.setItem('musicStarted', 'false');
        }
    }

    // Sau khi cửa mở, hiển thị thông báo cuối cùng
    setTimeout(() => {
        const finalMessage = "Hết bất ngờ rồi! Nhưng tình bạn 9A là mãi mãi! Chúc 20/10 vui vẻ! 🎉";
        const messageElement = document.getElementById('door-message');
        
        if (messageElement) {
            messageElement.style.color = 'var(--color-pink)'; // Đổi màu thông báo
            messageElement.innerHTML = finalMessage;
            messageElement.classList.add('visible');
        }
        
        // Tạo mưa confetti
        startConfetti();
        
        // Vô hiệu hóa click sau khi mở
        if (doorButton) doorButton.style.pointerEvents = 'none';

    }, 1500); // Sau 1.5s (thời gian animation cửa mở)
}

// --- Logic Confetti (Ruy băng giấy) ---
function createConfettiPiece() {
    const piece = document.createElement('div');
    piece.classList.add('confetti');
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = ['var(--color-pink)', 'var(--color-purple)', 'var(--color-white)'][Math.floor(Math.random() * 3)];
    piece.style.animationDelay = Math.random() * 5 + 's';
    piece.style.animationDuration = Math.random() * 3 + 4 + 's';
    piece.style.opacity = '1';
    return piece;
}

function startConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    container.style.display = 'block';
    
    for (let i = 0; i < 50; i++) {
        container.appendChild(createConfettiPiece());
    }
}


// --- Hàm khởi tạo chính ---
document.addEventListener('DOMContentLoaded', () => {
    initAudio(); // Khởi tạo âm thanh và kiểm tra trạng thái nhạc nền

    if (document.body.id === 'letter-page') {
        // Hàm đánh máy thư được gọi trong script của letter.html
        // Không cần gọi typeLetter() ở đây
    }
    
    if (document.body.id === 'flower-page') {
        setupFlowerPage(); // Bắt đầu timer để hiển thị thông báo
    }

    if (document.body.id === 'door-page') {
        const doorButton = document.getElementById('door-button');
        
        // Gắn sự kiện cho Cánh Cửa
        if (doorButton) doorButton.onclick = openDoor; 
    }
    
    // Thêm một phần tử điều khiển âm thanh (cho phép người dùng tự bật/tắt nhạc)
    if (!document.getElementById('audio-control')) {
        const audioControl = document.createElement('div');
        audioControl.id = 'audio-control';
        audioControl.innerHTML = localStorage.getItem('musicStarted') === 'true' ? '🔊' : '🔇';
        if (localStorage.getItem('musicStarted') !== 'true') audioControl.classList.add('paused');
        
        audioControl.title = 'Bật/Tắt Nhạc Nền';
        audioControl.onclick = () => {
            if (softPianoAudio) {
                if (softPianoAudio.paused) {
                    playSoftPiano();
                    audioControl.innerHTML = '🔊';
                    audioControl.classList.remove('paused');
                    localStorage.setItem('musicStarted', 'true');
                } else {
                    softPianoAudio.pause();
                    audioControl.innerHTML = '🔇';
                    audioControl.classList.add('paused');
                    localStorage.setItem('musicStarted', 'false');
                }
            }
        };
        document.body.appendChild(audioControl);
    }
});
