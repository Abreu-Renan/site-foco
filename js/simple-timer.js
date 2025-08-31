class SimpleTimer {
  constructor() {
    console.log("SimpleTimer constructor started");

    this.timeRemaining = 25 * 60; // 25 minutos em segundos
    this.isRunning = false;
    this.interval = null;
    this.selectedMinutes = 25;

    // Aguardar um pouco antes de procurar os elementos
    setTimeout(() => {
      this.initializeElements();
      this.initializeEventListeners();
      this.updateDisplay();
      this.resetProgress(); // Inicializar progresso do anel
    }, 200);
  }

  initializeElements() {
    console.log("Looking for elements...");

    this.timerDisplay = document.getElementById("timer-display");
    this.startPauseBtn = document.getElementById("start-pause-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.presetButtons = document.querySelectorAll(".preset-btn");

    // Elementos para animação
    this.progressRing = document.querySelector(".progress-ring-circle");
    this.timerCircle = document.querySelector(".time-circle");

    console.log("Elements found:", {
      timerDisplay: !!this.timerDisplay,
      startPauseBtn: !!this.startPauseBtn,
      resetBtn: !!this.resetBtn,
      presetButtons: this.presetButtons.length,
      progressRing: !!this.progressRing,
      timerCircle: !!this.timerCircle,
    });
  }

  initializeEventListeners() {
    console.log("Setting up event listeners...");

    if (this.startPauseBtn) {
      this.startPauseBtn.onclick = () => {
        console.log("Start/Pause clicked!");
        this.toggleTimer();
      };
      console.log("Start/Pause listener added");
    }

    if (this.resetBtn) {
      this.resetBtn.onclick = () => {
        console.log("Reset clicked!");
        this.resetTimer();
      };
      console.log("Reset listener added");
    }

    this.presetButtons.forEach((btn, index) => {
      btn.onclick = (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        console.log(`Preset ${minutes} clicked!`);
        this.setPresetTime(minutes);
      };
    });
    console.log(`${this.presetButtons.length} preset listeners added`);
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
    this.updateStartPauseButton();

    // Adicionar animações
    this.startAnimations();

    this.interval = setInterval(() => {
      this.timeRemaining--;
      this.updateDisplay();
      this.updateProgress(); // Atualizar progresso do anel

      if (this.timeRemaining <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }
  pauseTimer() {
    console.log("pauseTimer called");
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Remover animações
    this.stopAnimations();

    this.updateStartPauseButton();
  }

  resetTimer() {
    console.log("resetTimer called");
    this.pauseTimer();
    this.timeRemaining = this.selectedMinutes * 60;
    this.updateDisplay();
    this.resetProgress(); // Resetar progresso do anel
  }

  setPresetTime(minutes) {
    console.log("setPresetTime called with:", minutes);

    if (this.isRunning) {
      console.log("Timer is running, not changing preset");
      return;
    }

    this.selectedMinutes = minutes;
    this.timeRemaining = minutes * 60;

    // Atualizar botões ativos
    this.presetButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (parseInt(btn.dataset.minutes) === minutes) {
        btn.classList.add("active");
      }
    });

    this.updateDisplay();
    this.resetProgress(); // Resetar progresso ao mudar preset
  }

  updateDisplay() {
    if (!this.timerDisplay) return;

    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    this.timerDisplay.textContent = display;
  }

  updateStartPauseButton() {
    if (!this.startPauseBtn) return;

    const icon = this.startPauseBtn.querySelector("i");
    const text = this.startPauseBtn.querySelector("span");

    if (icon && text) {
      if (this.isRunning) {
        icon.className = "fas fa-pause";
        text.textContent = "Pausar";
      } else {
        icon.className = "fas fa-play";
        text.textContent = "Iniciar";
      }
    }
  }

  completeTimer() {
    console.log("Timer completed!");
    this.pauseTimer();
    this.playCompletionSound();
    this.showCompletionModal();
  }

  playCompletionSound() {
    try {
      // Criar contexto de áudio
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Criar oscillator para som de notificação
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Conectar oscillator ao gain e ao destino
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar som (frequência e tipo)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";

      // Configurar volume (fade in/out)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      // Tocar som
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      console.log("Completion sound played");
    } catch (error) {
      console.log("Could not play completion sound:", error);
    }
  }

  showCompletionModal() {
    const modal = document.getElementById("completion-modal");
    if (modal) {
      modal.classList.add("active");

      // Adicionar event listeners para os botões do modal
      this.setupModalButtons();
    }
  }

  hideCompletionModal() {
    const modal = document.getElementById("completion-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  }

  setupModalButtons() {
    // Botão "Continuar Focando" - reinicia com o mesmo tempo
    const continueFocusBtn = document.getElementById("continue-focus-btn");
    if (continueFocusBtn) {
      continueFocusBtn.onclick = () => {
        this.hideCompletionModal();
        this.resetTimer();
        this.startTimer();
      };
    }

    // Botão "Fazer uma Pausa" - apenas fecha o modal
    const takeBreakBtn = document.getElementById("take-break-btn");
    if (takeBreakBtn) {
      takeBreakBtn.onclick = () => {
        this.hideCompletionModal();
        // Timer permanece resetado, usuário pode escolher novo tempo
      };
    }

    // Botão "Fechar" - apenas fecha o modal
    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        this.hideCompletionModal();
      };
    }

    // Fechar modal clicando no fundo
    const modal = document.getElementById("completion-modal");
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          this.hideCompletionModal();
        }
      };
    }
  }

  // Métodos para controlar o progresso do anel
  updateProgress() {
    if (!this.progressRing) return;

    // Calcular progresso (0 = início, 1 = completo)
    const totalTime = this.selectedMinutes * 60;
    const elapsed = totalTime - this.timeRemaining;
    const progress = elapsed / totalTime;

    // Circunferência do círculo (2 * π * raio)
    const circumference = 2 * Math.PI * 80; // raio = 80

    // Calcular offset para mostrar progresso
    const offset = circumference - progress * circumference;

    // Aplicar o offset
    this.progressRing.style.strokeDashoffset = offset;

    console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
  }

  resetProgress() {
    if (!this.progressRing) return;

    // Resetar para posição inicial (círculo vazio)
    const circumference = 2 * Math.PI * 80;
    this.progressRing.style.strokeDashoffset = circumference;
  }

  // Métodos para controlar animações
  startAnimations() {
    console.log("startAnimations called");

    if (this.progressRing) {
      this.progressRing.classList.add("running");
      console.log("Added 'running' class to progress ring");
    } else {
      console.error("Progress ring element not found!");
    }
  }

  stopAnimations() {
    console.log("stopAnimations called");
    if (this.progressRing) {
      this.progressRing.classList.remove("running");
      console.log("Removed 'running' class from progress ring");
    }
  }
}

// Inicializar o timer simples
console.log("About to create SimpleTimer...");
window.simpleTimer = new SimpleTimer();
