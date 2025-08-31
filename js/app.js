// Arquivo principal da aplicação
class FocusApp {
  constructor() {
    this.timer = null;
    this.statsManager = null;
    this.youtubeSync = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Aguardar o DOM estar completamente carregado
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          document.addEventListener("DOMContentLoaded", resolve);
        });
      }

      console.log("Initializing app...");

      // Inicializar gerenciador de estatísticas
      this.statsManager = new StatsManager();
      window.statsManager = this.statsManager;

      // Temporariamente desabilitado para debug
      // Inicializar sincronização com YouTube
      // this.youtubeSync = new YoutubeSync();
      // window.youtubeSync = this.youtubeSync;

      console.log("About to initialize timer...");
      // Inicializar timer
      this.timer = new FocusTimer();
      console.log("Timer initialized:", !!this.timer);

      // Configurar eventos globais
      this.setupGlobalEvents();

      // Configurar service worker para notificações offline
      this.setupServiceWorker();

      this.initialized = true;
      console.log("Foco Timer inicializado com sucesso!");
    } catch (error) {
      console.error("Erro ao inicializar a aplicação:", error);
    }
  }

  setupGlobalEvents() {
    // Detectar quando a aba fica inativa/ativa
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Aba ficou inativa
        this.handleTabInactive();
      } else {
        // Aba ficou ativa
        this.handleTabActive();
      }
    });

    // Detectar quando a janela vai ser fechada
    window.addEventListener("beforeunload", (e) => {
      if (this.timer && this.timer.isRunning) {
        e.preventDefault();
        e.returnValue = "Você tem um timer rodando. Tem certeza que quer sair?";
        return e.returnValue;
      }
    });

    // Eventos de teclado globais
    document.addEventListener("keydown", (e) => {
      // Esc para fechar modais
      if (e.key === "Escape") {
        const modal = document.querySelector(".modal-overlay.active");
        if (modal) {
          modal.classList.remove("active");
        }
      }

      // Ctrl+S para exportar estatísticas
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        this.statsManager.exportStats();
      }
    });

    // Adicionar botão de exportar estatísticas
    this.addExportButton();
  }

  handleTabInactive() {
    // Salvar estado quando a aba fica inativa
    if (this.timer) {
      localStorage.setItem(
        "timerState",
        JSON.stringify({
          timeRemaining: this.timer.timeRemaining,
          isRunning: this.timer.isRunning,
          selectedMinutes: this.timer.selectedMinutes,
          timestamp: Date.now(),
        })
      );
    }
  }

  handleTabActive() {
    // Restaurar estado quando a aba fica ativa
    try {
      const savedState = localStorage.getItem("timerState");
      if (savedState && this.timer) {
        const state = JSON.parse(savedState);
        const timePassed = Math.floor((Date.now() - state.timestamp) / 1000);

        if (state.isRunning) {
          const newTimeRemaining = Math.max(
            0,
            state.timeRemaining - timePassed
          );

          if (newTimeRemaining > 0) {
            this.timer.timeRemaining = newTimeRemaining;
            this.timer.updateDisplay();
            this.timer.updateProgressRing();
          } else {
            // Timer acabou enquanto a aba estava inativa
            this.timer.completeTimer();
          }
        }
      }
    } catch (error) {
      console.log("Erro ao restaurar estado do timer:", error);
    }
  }

  addExportButton() {
    const statsCard = document.querySelector(".stats-card");
    if (statsCard) {
      const exportBtn = document.createElement("button");
      exportBtn.className = "btn btn-secondary";
      exportBtn.style.width = "100%";
      exportBtn.style.marginTop = "20px";
      exportBtn.style.fontSize = "0.9rem";
      exportBtn.innerHTML =
        '<i class="fas fa-download"></i> Exportar Estatísticas';

      exportBtn.addEventListener("click", () => {
        this.statsManager.exportStats();
      });

      statsCard.appendChild(exportBtn);
    }
  }

  async setupServiceWorker() {
    // Registrar service worker para notificações offline (se disponível)
    if ("serviceWorker" in navigator) {
      try {
        // Por simplicidade, não vamos implementar um service worker completo
        // mas deixamos a estrutura pronta para expansão futura
        console.log(
          "Service Worker pode ser implementado para recursos offline"
        );
      } catch (error) {
        console.log("Service Worker não disponível:", error);
      }
    }
  }

  // Métodos utilitários
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface);
            color: var(--text-primary);
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            box-shadow: 0 10px 30px var(--shadow);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

    if (type === "success") {
      toast.style.borderColor = "var(--success-color)";
    } else if (type === "error") {
      toast.style.borderColor = "var(--error-color)";
    }

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 100);

    // Remover após 3 segundos
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Método para adicionar novas funcionalidades no futuro
  extendApp(extension) {
    if (typeof extension === "function") {
      extension.call(this);
    }
  }
}

// Adicionar alguns estilos CSS dinâmicos para melhor UX
const dynamicStyles = `
    .toast {
        font-family: 'Poppins', sans-serif;
    }
    
    .timer-card.pulsing {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .stat-item {
        animation: slideIn 0.5s ease-out;
    }
    
    .stat-item:nth-child(1) { animation-delay: 0.1s; }
    .stat-item:nth-child(2) { animation-delay: 0.2s; }
    .stat-item:nth-child(3) { animation-delay: 0.3s; }
    
    /* Melhorar acessibilidade */
    .btn:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .preset-btn:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    /* Indicador de loading */
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        to {
            left: 100%;
        }
    }
`;

// Adicionar estilos dinâmicos
const styleSheet = document.createElement("style");
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Inicializar a aplicação
const app = new FocusApp();

// Função para garantir que tudo seja inicializado corretamente
function initApp() {
  console.log("Document ready state:", document.readyState);

  // Aguardar um breve delay para garantir que todos os elementos estejam carregados
  setTimeout(() => {
    app.init();
  }, 100);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Disponibilizar globalmente para debugging
window.focusApp = app;

// Log de boas-vindas
console.log(
  "%c🎯 Foco Timer carregado com sucesso!",
  "color: #6366f1; font-size: 16px; font-weight: bold;"
);
console.log("%cAtalhos disponíveis:", "color: #6366f1; font-weight: bold;");
console.log("- Espaço: Iniciar/Pausar timer");
console.log("- R: Resetar timer");
console.log("- Esc: Fechar modais");
console.log("- Ctrl+S: Exportar estatísticas");
