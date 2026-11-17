// =========================================================================
// НАСТРОЙКА ДАТЫ И ВРЕМЕНИ ТОРЖЕСТВА (Время 15:00 уже установлено)
// По умолчанию ставится ближайшая праздничная дата в 15:00, можно указать точную дату:
// Например: const CUSTOM_EVENT_DATE = "2026-11-28T15:00:00";
// =========================================================================
const CUSTOM_EVENT_DATE = null;

function getTargetDate() {
  if (CUSTOM_EVENT_DATE) {
    return new Date(CUSTOM_EVENT_DATE);
  }
  const now = new Date();
  const target = new Date(now);
  target.setDate(now.getDate() + 10);
  target.setHours(15, 0, 0, 0);
  return target;
}

const targetEventDate = getTargetDate();

// 1. Вступительный экран-конверт и запуск нежной мелодии
const welcomeOverlay = document.getElementById('welcomeOverlay');
const openInviteBtn = document.getElementById('openInviteBtn');
const musicToggle = document.getElementById('musicToggle');
const musicBars = document.getElementById('musicBars');
const musicLabel = document.getElementById('musicLabel');

let audioCtx = null;
let isPlayingMusic = false;
let melodyInterval = null;

// Нежная праздничная мелодия в стиле музыкальной шкатулки (бешик ыры / колыбельная)
const melodyNotes = [
  523.25, 659.25, 783.99, 659.25,
  880.00, 783.99, 659.25, 587.33,
  523.25, 587.33, 659.25, 783.99,
  659.25, 587.33, 523.25, 523.25
];
let noteIndex = 0;

function playGentleNote(freq) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioCtx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + 1.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);
}

function startMusic() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (isPlayingMusic) return;
    isPlayingMusic = true;
    musicBars.classList.add('playing');
    musicLabel.textContent = 'Музыка';

    playGentleNote(melodyNotes[noteIndex % melodyNotes.length]);
    noteIndex++;

    melodyInterval = setInterval(() => {
      if (!isPlayingMusic) return;
      playGentleNote(melodyNotes[noteIndex % melodyNotes.length]);
      noteIndex++;
    }, 650);
  } catch (err) {
    console.warn('Audio autoplay prevented:', err);
  }
}

function stopMusic() {
  isPlayingMusic = false;
  musicBars.classList.remove('playing');
  musicLabel.textContent = 'Үнсүз';
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

if (openInviteBtn && welcomeOverlay) {
  openInviteBtn.addEventListener('click', () => {
    welcomeOverlay.classList.add('hidden');
    startMusic();
  });
}

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

// 2. Таймер обратного отсчёта до 15:00
function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetEventDate.getTime() - now;

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (distance <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 3. Падающие нежные розовые лепестки
function createPetals() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;

  const count = 16;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = Math.random() * 10 + 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.25}px`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${Math.random() * 8 + 9}s`;
    petal.style.animationDelay = `${Math.random() * 7}s`;
    container.appendChild(petal);
  }
}

createPetals();

// 4. Плавное появление карточек при прокрутке
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// 5. Обработка формы анкеты гостя (RSVP)
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpSuccessText = document.getElementById('rsvpSuccessText');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('guestName').value.trim();
    const attendance = rsvpForm.querySelector('input[name="attendance"]:checked')?.value || '';
    const wishes = document.getElementById('guestWishes').value.trim();

    rsvpForm.style.display = 'none';
    if (rsvpSuccess) {
      rsvpSuccess.style.display = 'block';
      rsvpSuccessText.textContent = `Урматтуу ${guestName}, сиздин жообуңуз («${attendance}») кабыл алынды!${
        wishes ? ' Каалоо-тилегиңиз үчүн чоң рахмат!' : ''
      }`;
    }
  });
}

// 6. Кнопка копирования публичной ссылки
const PUBLIC_INVITE_URL = 'https://is.gd/azaliya_jeentek_toi';
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyLinkText = document.getElementById('copyLinkText');

if (copyLinkBtn && copyLinkText) {
  copyLinkBtn.addEventListener('click', async () => {
    const urlToCopy = window.location.hostname.includes('localhost')
      ? PUBLIC_INVITE_URL
      : window.location.href;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      copyLinkText.textContent = 'Ссылка скопирована! ✓';
      setTimeout(() => {
        copyLinkText.textContent = 'Скопировать ссылку';
      }, 2500);
    } catch {
      const input = document.createElement('input');
      input.value = urlToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      copyLinkText.textContent = 'Ссылка скопирована! ✓';
      setTimeout(() => {
        copyLinkText.textContent = 'Скопировать ссылку';
      }, 2500);
    }
  });
}
