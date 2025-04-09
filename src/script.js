let timerInterval;
let startTime = null;

const bgImage = document.getElementById('bgImage');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const bgColorInput = document.getElementById('bgColorInput');
const bgImageInput = document.getElementById('bgImageInput');
const opacitySlider = document.getElementById('opacitySlider');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const removeBgImage = document.getElementById('removeBgImageBtn');
const timerColorInput = document.getElementById('timerColorInput');

function updateTimerDisplay() {
  if (!startTime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  timerElement.textContent = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;
  if (!startTime) {
    startTime = Date.now();
    saveSettings();
  }
  timerInterval = setInterval(updateTimerDisplay, 1000);

  startBtn.disabled = true;
  startBtn.style.display = 'none';
  resetBtn.style.display = 'inline';
}

function resetTimer() {
  if (window.confirm('Quer realmente reiniciar o cronômetro?')) {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;

    timerElement.textContent = '00:00:00';
    startBtn.disabled = false;
    startBtn.style.display = 'inline';
    resetBtn.style.display = 'none';

    settingsModal.classList.remove('flex');

    saveSettings();
  }
}

function setBackgroundColor(color) {
  document.body.style.backgroundColor = color;
  saveSettings();
}

function setBackgroundImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    bgImage.src = reader.result;
    bgImage.style.display = 'inline';

    // Hide the input, show the remove button and slider
    bgImageInput.style.display = 'none';
    removeBgImage.style.display = 'inline';
    opacitySlider.style.display = 'inline';

    saveSettings();
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function removeBackgroundImage() {
  bgImage.src = '';
  bgImage.style.display = 'none';

  // Clear the input value and reset styles to show the only input
  bgImageInput.value = '';
  bgImageInput.style.display = 'inline';
  removeBgImage.style.display = 'none';
  opacitySlider.style.display = 'none';

  saveSettings();
}

function setOpacity(opacity) {
  bgImage.style.opacity = opacity;
  saveSettings();
}

function setTimerColor(color) {
  timerElement.style.color = color;
  settingsBtn.style.fill = color;
  settingsBtn.style.borderColor = color;
  saveSettings();
}

function changeBgImage(src) {
  if (src) {
    bgImage.src = src;
    bgImage.style.display = 'inline';
    return
  }

  bgImage.style.display = 'none';
}

function saveSettings() {
  const settings = {
    startTime,
    bgColor: bgColorInput.value,
    bgImageSrc: bgImage.src.startsWith('data:image/') ? bgImage.src : null,
    opacity: opacitySlider.value,
    timerColor: timerColorInput.value,
  };
  localStorage.setItem('timerSettings', JSON.stringify(settings));
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('timerSettings'));
  if (settings) {
    startTime = settings.startTime ? new Date(settings.startTime).getTime() : null;
    bgColorInput.value = settings.bgColor;
    document.body.style.backgroundColor = settings.bgColor;
    opacitySlider.value = settings.opacity || '0';
    timerColorInput.value = settings.timerColor || '#ffffff';
    timerElement.style.color = settings.timerColor || '#ffffff';
    settingsBtn.style.fill = settings.timerColor || '#ffffff';
    settingsBtn.style.borderColor = settings.timerColor || '#ffffff';

    if (settings.bgImageSrc) {
      bgImage.src = settings.bgImageSrc;
      bgImage.style.display = 'inline';
      bgImage.style.opacity = opacitySlider.value;
      removeBgImage.style.display = 'inline';
      bgImageInput.style.display = 'none';
      opacitySlider.style.display = 'inline';
    } else {
      bgImage.src = '';
      bgImage.style.display = 'none';
      removeBgImage.style.display = 'none';
      bgImageInput.style.display = 'inline';
      opacitySlider.style.display = 'none';
    }

    if (startTime) {
      startBtn.style.display = 'none';
      resetBtn.style.display = 'inline';
      startTimer()
    } else {
      startBtn.style.display = 'inline';
      resetBtn.style.display = 'none';
    };

    return;
  }

  document.body.style.backgroundColor = '#000000';
  bgColorInput.value = '#000000';

  timerElement.style.color = '#ffffff';
  timerColorInput.value = '#ffffff';
  settingsBtn.style.fill = '#ffffff';
  settingsBtn.style.borderColor = '#ffffff';

  bgImage.style.display = 'none';
  bgImage.src = '';
  removeBgImage.style.display = 'none';
  bgImageInput.style.display = 'inline';
  opacitySlider.style.display = 'none';

  startBtn.style.display = 'inline';
  resetBtn.style.display = 'none';
}

// Modal Handlers
settingsBtn.addEventListener('click', () => settingsModal.classList.add('flex'));
closeModal.addEventListener('click', () => settingsModal.classList.remove('flex'));
document.addEventListener('click', (e) => {
  if (!settingsModal.contains(e.target) && e.target !== settingsBtn) {
    settingsModal.classList.remove('flex');
  }
});

// Ensure modal starts closed
settingsModal.classList.remove('flex');

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
bgColorInput.addEventListener('input', (e) => setBackgroundColor(e.target.value));
bgImageInput.addEventListener('change', (e) => setBackgroundImage(e.target.files[ 0 ]));
removeBgImage.addEventListener('click', removeBackgroundImage);
opacitySlider.addEventListener('input', (e) => setOpacity(e.target.value));
timerColorInput.addEventListener('input', (e) => setTimerColor(e.target.value));

// Initialize
loadSettings();
updateTimerDisplay();
