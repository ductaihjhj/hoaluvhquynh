// ===========================
// Main JavaScript - Vườn Hoa 20/10 (Auto-play Drive Music)
// ===========================

const CONFIG = {
  PASSWORD: '2010love',
  OPEN_SOUND: 'https://drive.google.com/uc?export=download&id=1PSvFVUId6xe_Xra935lTirejcaZWGRvC'
};

// DOM Elements
const el = {
  musicToggle: document.getElementById('musicToggle'),
  bgMusic: document.getElementById('bgMusic'),
  letterBtn: document.getElementById('letterBtn'),
  passwordModal: document.getElementById('passwordModal'),
  closePasswordModal: document.getElementById('closePasswordModal'),
  passwordInput: document.getElementById('passwordInput'),
  togglePassword: document.getElementById('togglePassword'),
  submitPassword: document.getElementById('submitPassword'),
  errorMessage: document.getElementById('errorMessage'),
  letterModal: document.getElementById('letterModal'),
  closeLetterModal: document.getElementById('closeLetterModal')
};

// ===========================
// MUSIC CONTROL + AUTO-PLAY
// ===========================
let isPlaying = false;
let hasTriedAutoPlay = false;

const bgMusic = el.bgMusic || new Audio(CONFIG.OPEN_SOUND);
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.crossOrigin = "anonymous";

el.musicToggle.addEventListener('click', toggleMusic);

async function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    el.musicToggle.classList.remove('playing');
    el.musicToggle.querySelector('.music-text').textContent = 'Play';
  } else {
    try {
      await bgMusic.play();
      el.musicToggle.classList.add('playing');
      el.musicToggle.querySelector('.music-text').textContent = 'Pause';
    } catch (err) {
      showNotification('Hãy chạm vào màn hình để bật nhạc 🎵', 'error');
    }
  }
  isPlaying = !isPlaying;
}

// Auto-play ngay khi load
window.addEventListener('load', async () => {
  if (!hasTriedAutoPlay) {
    hasTriedAutoPlay = true;
    try {
      await bgMusic.play();
      el.musicToggle.classList.add('playing');
      el.musicToggle.querySelector('.music-text').textContent = 'Pause';
      isPlaying = true;
      console.log('🎶 Auto-play thành công!');
    } catch {
      console.warn('⚠️ Auto-play bị chặn, cần tương tác người dùng.');
      showNotification('Nhấn màn hình để bật nhạc 💖', 'error');
    }
  }
});

// ===========================
// MODALS
// ===========================
el.letterBtn.addEventListener('click', openPasswordModal);
el.closePasswordModal.addEventListener('click', closePasswordModal);
el.closeLetterModal.addEventListener('click', closeLetterModal);
el.togglePassword.addEventListener('click', togglePassword);
el.submitPassword.addEventListener('click', checkPassword);
el.passwordInput.addEventListener('keypress', e => e.key === 'Enter' && checkPassword());

function openPasswordModal() {
  el.passwordModal.classList.add('active');
  const modalContent = el.passwordModal.querySelector('.modal-content');
  gsap.fromTo(modalContent, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
  el.passwordInput.value = '';
  el.passwordInput.focus();
  clearTimeout(window._closeModalTimeout);
}

function closePasswordModal() {
  const modalContent = el.passwordModal.querySelector('.modal-content');
  gsap.to(modalContent, {
    scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => el.passwordModal.classList.remove('active')
  });
}

function openLetterModal() {
  el.letterModal.classList.add('active');
  const audio = new Audio(CONFIG.OPEN_SOUND);
  audio.volume = 0.4;
  audio.play();

  const paper = el.letterModal.querySelector('.letter-paper');
  gsap.fromTo(paper, { rotateX: -60, opacity: 0, scale: 0.9 }, { rotateX: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });

  const text = el.letterModal.querySelectorAll('.letter-body p, .letter-greeting, .letter-signature');
  gsap.from(text, { opacity: 0, y: 20, stagger: 0.1, duration: 0.6, delay: 0.5 });
}

function closeLetterModal() {
  const paper = el.letterModal.querySelector('.letter-paper');
  gsap.to(paper, {
    opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in',
    onComplete: () => el.letterModal.classList.remove('active')
  });
}

// ===========================
// PASSWORD CHECK
// ===========================
function togglePassword() {
  const isHidden = el.passwordInput.type === 'password';
  el.passwordInput.type = isHidden ? 'text' : 'password';
  el.togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
}

function checkPassword() {
  const input = el.passwordInput.value.trim();
  el.errorMessage.textContent = '';

  if (!input) {
    showError('Vui lòng nhập mật khẩu 💫');
    shake(el.passwordInput);
    return;
  }

  if (input === CONFIG.PASSWORD) {
    showSuccess('✓ Chính xác! Đang mở thư... 💌');
    setTimeout(() => {
      closePasswordModal();
      setTimeout(openLetterModal, 400);
    }, 500);
  } else {
    showError('Sai mật khẩu rồi nha 🌸');
    shake(el.passwordInput);
    shake(el.passwordModal.querySelector('.modal-content'));
  }
}

// ===========================
// UTILITIES
// ===========================
function showError(msg) {
  el.errorMessage.textContent = msg;
  el.errorMessage.style.color = '#e91e63';
  gsap.from(el.errorMessage, { opacity: 0, y: -5, duration: 0.3 });
}
function showSuccess(msg) {
  el.errorMessage.textContent = msg;
  el.errorMessage.style.color = '#4caf50';
  gsap.from(el.errorMessage, { opacity: 0, scale: 0.9, duration: 0.3 });
}
function shake(target) {
  gsap.to(target, { x: [-10, 10, -10, 10, 0], duration: 0.4, ease: 'power2.out' });
}
function showNotification(msg, type = 'info') {
  const note = document.createElement('div');
  note.textContent = msg;
  note.className = `notification ${type}`;
  note.style.cssText = `
    position: fixed; top: 80px; right: 20px;
    background: rgba(255,255,255,0.95);
    padding: 14px 24px; border-radius: 15px;
    border: 2px solid ${type === 'error' ? '#e91e63' : '#4caf50'};
    font-family: 'Quicksand'; font-weight: 600;
    color: ${type === 'error' ? '#e91e63' : '#4caf50'};
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    opacity: 0; z-index: 10000;
  `;
  document.body.appendChild(note);
  gsap.to(note, { opacity: 1, duration: 0.3 });
  setTimeout(() => gsap.to(note, { opacity: 0, x: 100, duration: 0.4, onComplete: () => note.remove() }), 3000);
}

// ===========================
// KEYBOARD SHORTCUTS
// ===========================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (el.letterModal.classList.contains('active')) closeLetterModal();
    if (el.passwordModal.classList.contains('active')) closePasswordModal();
  }
  if (e.key === ' ' && !el.passwordModal.classList.contains('active') && !el.letterModal.classList.contains('active')) {
    e.preventDefault();
    toggleMusic();
  }
});

// ===========================
// Sub-Greeting Text Switcher (3s)
// ===========================
window.addEventListener('load', () => {
  const subGreeting = document.getElementById('subGreeting');
  if (!subGreeting) return;

  let showingOriginal = true;

  const switchText = () => {
    subGreeting.style.transition = 'opacity 0.8s ease';
    subGreeting.style.opacity = '0';

    setTimeout(() => {
      if (showingOriginal) {
        subGreeting.innerHTML = 'Hương Quỳnh <span class="heart">💖</span>';
        subGreeting.style.fontFamily = "'EB Garamond', serif";
        subGreeting.style.color = '#e91e63';
        subGreeting.style.textShadow = '0 0 10px rgba(255,182,193,0.6), 0 0 20px rgba(230,213,245,0.4)';
      } else {
        subGreeting.textContent = 'Gửi đến người con gái tuyệt vời nhất :3';
        subGreeting.style.fontFamily = "'Comfortaa', sans-serif";
        subGreeting.style.color = '#8e24aa';
        subGreeting.style.textShadow = 'none';
      }
      showingOriginal = !showingOriginal;
      subGreeting.style.opacity = '1';
    }, 700);
  };
  setInterval(switchText, 3000);
});

console.log('%c🌸 Welcome to Vườn Hoa 20/10 🌸', 'color:#e91e63;font-size:18px;font-weight:bold;');
console.log('%cHint: Mật khẩu là 2010love ❤️', 'color:#8e24aa;');
