class FocusTimer {
  constructor() {
    this.timeRemaining = 25 * 60; // 25 minutos em segundos
    this.initialTime = 25 * 60;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.selectedMinutes = 25;

    // Configurações
    this.soundEnabled = true;
    this.autoBreakEnabled = false;
    this.musicSyncEnabled = false; // Inicializar como false por padrão

    // Elementos do DOM
    this.timerDisplay = document.getElementById("timer-display");
    this.timerMode = document.getElementById("timer-mode");
    this.startPauseBtn = document.getElementById("start-pause-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.presetButtons = document.querySelectorAll(".preset-btn");
    this.progressCircle = document.querySelector(".progress-ring-circle");
    this.timerCard = document.querySelector(".timer-card");
    this.soundToggle = document.getElementById("sound-toggle");
    this.autoBreakToggle = document.getElementById("auto-break-toggle");
    this.completionModal = document.getElementById("completion-modal");
    this.startBreakBtn = document.getElementById("start-break-btn");
    this.continueFocusBtn = document.getElementById("continue-focus-btn");

    console.log("FocusTimer constructor - Elements found:", {
      timerDisplay: !!this.timerDisplay,
      startPauseBtn: !!this.startPauseBtn,
      presetButtons: this.presetButtons.length,
    });

    this.initializeEventListeners();
    this.updateDisplay();
    this.updateProgressRing();
  }

  initializeEventListeners() {
    // Debug: verificar se os elementos foram encontrados
    console.log("Inicializando event listeners...");
    console.log("Elementos encontrados:", {
      startPauseBtn: !!this.startPauseBtn,
      resetBtn: !!this.resetBtn,
      presetButtons: this.presetButtons.length,
      timerDisplay: !!this.timerDisplay,
    });

    // Botões de controle - com verificação de segurança
    if (this.startPauseBtn) {
      this.startPauseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Play/Pause button clicked!");
        this.toggleTimer();
      });
    } else {
      console.error("Start/Pause button not found!");
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Reset button clicked!");
        this.resetTimer();
      });
    } else {
      console.error("Reset button not found!");
    }

    // Botões de preset - com verificação de segurança
    if (this.presetButtons.length > 0) {
      this.presetButtons.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const minutes = parseInt(e.target.dataset.minutes);
          console.log("Preset button clicked:", minutes);
          this.setPresetTime(minutes);
        });
      });
    } else {
      console.error("Preset buttons not found!");
    }

    // Configurações
    this.soundToggle.addEventListener("change", (e) => {
      this.soundEnabled = e.target.checked;
    });

    this.autoBreakToggle.addEventListener("change", (e) => {
      this.autoBreakEnabled = e.target.checked;
    });

    // Toggle de sincronização da música
    const musicSyncToggle = document.getElementById("music-sync-toggle");
    if (musicSyncToggle) {
      musicSyncToggle.addEventListener("change", (e) => {
        this.musicSyncEnabled = e.target.checked;
      });
      this.musicSyncEnabled = musicSyncToggle.checked;
    } else {
      this.musicSyncEnabled = false;
    }

    // Modal de conclusão
    this.startBreakBtn.addEventListener("click", () => {
      this.hideCompletionModal();
      this.startBreak();
    });

    this.continueFocusBtn.addEventListener("click", () => {
      this.hideCompletionModal();
      this.resetTimer();
    });

    // Fechar modal clicando fora
    this.completionModal.addEventListener("click", (e) => {
      if (e.target === this.completionModal) {
        this.hideCompletionModal();
      }
    });

    // Atalhos do teclado
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        this.resetTimer();
      }
    });
  }

  setPresetTime(minutes) {
    if (this.isRunning) return;

    this.selectedMinutes = minutes;
    this.timeRemaining = minutes * 60;
    this.initialTime = minutes * 60;

    // Atualizar botões ativos
    this.presetButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (parseInt(btn.dataset.minutes) === minutes) {
        btn.classList.add("active");
      }
    });

    this.updateDisplay();
    this.updateProgressRing();
  }

  toggleTimer() {
    console.log("toggleTimer called, isRunning:", this.isRunning);
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    console.log("startTimer called");
    this.isRunning = true;
    this.isPaused = false;
    this.timerCard.classList.add("active");

    // Sincronizar com YouTube se habilitado
    if (this.musicSyncEnabled && window.youtubeSync) {
      console.log("Starting YouTube sync");
      if (this.isPaused) {
        window.youtubeSync.resumeWithTimer();
      } else {
        window.youtubeSync.startWithTimer();
      }
    }

    this.updateStartPauseButton();

    this.interval = setInterval(() => {
      this.timeRemaining--;
      this.updateDisplay();
      this.updateProgressRing();

      if (this.timeRemaining <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.isPaused = true;
    this.timerCard.classList.remove("active");

    // Pausar YouTube junto com o timer se habilitado
    if (this.musicSyncEnabled && window.youtubeSync) {
      window.youtubeSync.pauseWithTimer();
    }

    clearInterval(this.interval);
    this.updateStartPauseButton();
  }

  resetTimer() {
    this.isRunning = false;
    this.isPaused = false;
    this.timerCard.classList.remove("active");

    clearInterval(this.interval);
    this.timeRemaining = this.initialTime;

    this.updateDisplay();
    this.updateProgressRing();
    this.updateStartPauseButton();
  }

  completeTimer() {
    this.isRunning = false;
    this.timerCard.classList.remove("active");

    clearInterval(this.interval);

    // Animação de conclusão
    this.progressCircle.classList.add("completed");
    setTimeout(() => {
      this.progressCircle.classList.remove("completed");
    }, 1000);

    // Som de notificação
    if (this.soundEnabled) {
      this.playNotificationSound();
    }

    // Notificação do navegador
    this.showBrowserNotification();

    // Atualizar estatísticas
    if (window.statsManager) {
      window.statsManager.addCompletedSession(this.selectedMinutes);
    }

    // Mostrar modal de conclusão
    this.showCompletionModal();

    this.updateStartPauseButton();
  }

  startBreak() {
    this.selectedMinutes = 5;
    this.timeRemaining = 5 * 60;
    this.initialTime = 5 * 60;
    this.timerMode.textContent = "Pausa";

    this.updateDisplay();
    this.updateProgressRing();

    if (this.autoBreakEnabled) {
      this.startTimer();
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;

    this.timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Atualizar título da página
    document.title = `${this.timerDisplay.textContent} - Foco Timer`;
  }

  updateProgressRing() {
    const circumference = 2 * Math.PI * 80; // raio = 80
    const progress = 1 - this.timeRemaining / this.initialTime;
    const offset = circumference - progress * circumference;

    this.progressCircle.style.strokeDashoffset = offset;
  }

  updateStartPauseButton() {
    if (!this.startPauseBtn) {
      console.error("startPauseBtn not found!");
      return;
    }

    const icon = this.startPauseBtn.querySelector("i");
    const text = this.startPauseBtn.querySelector("span");

    if (!icon || !text) {
      console.error("Button icon or text not found!", {
        icon: !!icon,
        text: !!text,
      });
      return;
    }

    if (this.isRunning) {
      icon.className = "fas fa-pause";
      text.textContent = "Pausar";
    } else {
      icon.className = "fas fa-play";
      text.textContent = this.isPaused ? "Continuar" : "Iniciar";
    }
  }

  showCompletionModal() {
    this.completionModal.classList.add("active");
  }

  hideCompletionModal() {
    this.completionModal.classList.remove("active");
    this.timerMode.textContent = "Foco";
  }

  playNotificationSound() {
    try {
      // Criar um som simples usando AudioContext
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log("Não foi possível reproduzir o som:", error);
    }
  }

  showBrowserNotification() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Foco Timer", {
          body: "Sessão de foco concluída! Parabéns!",
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366f1"/><text x="50" y="65" text-anchor="middle" fill="white" font-size="30">⏰</text></svg>',
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            this.showBrowserNotification();
          }
        });
      }
    }
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  // Solicitar permissão para notificações
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
});
