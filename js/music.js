class MusicManager {
  constructor() {
    this.isPlaying = false;
    this.youtubePlayer = null;

    // Elementos do DOM
    this.toggleMusicBtn = document.getElementById("toggle-music-btn");
    this.youtubeIframe = document.getElementById("youtube-player");

    this.initializeEventListeners();

    // Aguardar um pouco antes de tentar inicializar a API
    setTimeout(() => {
      this.initializeYouTubeAPI();
    }, 1000);
  }

  initializeEventListeners() {
    if (this.toggleMusicBtn) {
      this.toggleMusicBtn.addEventListener("click", () => {
        console.log("Botão de música clicado!");
        this.toggleMusic();
      });
    } else {
      console.log("Botão de música não encontrado!");
    }
  }

  initializeYouTubeAPI() {
    // Adicionar a API do YouTube se ainda não estiver carregada
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Callback quando a API estiver pronta
      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    // Esta função será chamada quando a API do YouTube estiver pronta
    try {
      this.youtubePlayer = new YT.Player("youtube-player", {
        events: {
          onReady: (event) => {
            console.log("Player do YouTube pronto!");
          },
          onStateChange: (event) => {
            this.onPlayerStateChange(event);
          },
        },
      });
    } catch (error) {
      console.log("Erro ao criar player do YouTube:", error);
    }
  }

  onPlayerStateChange(event) {
    // Atualizar o estado do botão baseado no estado do player
    if (event.data === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.updateButtonState();
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      this.isPlaying = false;
      this.updateButtonState();
    }
  }

  toggleMusic() {
    console.log("toggleMusic chamado, isPlaying:", this.isPlaying);

    // Sempre usar o método básico por ser mais confiável
    this.toggleBasicMusic();
  }

  toggleBasicMusic() {
    console.log("toggleBasicMusic chamado");

    // Controle básico - simplesmente alterna o estado visual
    this.isPlaying = !this.isPlaying;
    this.updateButtonState();

    if (this.isPlaying) {
      // Tentar dar play através do iframe (pode não funcionar devido a políticas do navegador)
      this.startPlayback();
      this.showToast(
        "🎵 Clique no botão ▶️ do player do YouTube para iniciar a música!",
        "info"
      );
    } else {
      this.showToast(
        "⏸️ Use os controles do player para pausar a música.",
        "info"
      );
    }
  }

  startPlayback() {
    // Tentar diferentes métodos para iniciar a reprodução
    try {
      if (this.youtubeIframe) {
        // Método 1: Tentar usar postMessage (pode não funcionar)
        this.youtubeIframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      }
    } catch (error) {
      console.log("Método postMessage não funcionou:", error);
    }
  }

  updateButtonState() {
    console.log("updateButtonState chamado, isPlaying:", this.isPlaying);

    if (!this.toggleMusicBtn) {
      console.log("toggleMusicBtn não encontrado!");
      return;
    }

    const icon = this.toggleMusicBtn.querySelector("i");
    const text = this.toggleMusicBtn.querySelector("span");

    if (this.isPlaying) {
      icon.className = "fas fa-pause";
      text.textContent = "Player Ativo";
      this.toggleMusicBtn.classList.remove("btn-secondary");
      this.toggleMusicBtn.classList.add("btn-primary");
    } else {
      icon.className = "fas fa-play";
      text.textContent = "Ativar Player";
      this.toggleMusicBtn.classList.remove("btn-primary");
      this.toggleMusicBtn.classList.add("btn-secondary");
    }

    console.log("Botão atualizado para:", this.isPlaying ? "Ativo" : "Inativo");
  }

  // Métodos para integração com o timer
  startMusicWithTimer() {
    // Iniciar música automaticamente quando o timer começar
    if (!this.isPlaying) {
      this.toggleMusic();
    }
  }

  pauseMusicWithTimer() {
    // Pausar música quando o timer parar
    if (this.isPlaying) {
      this.toggleMusic();
    }
  }

  // Método para mostrar notificações
  showToast(message, type = "info") {
    // Usar o método de toast do app principal se disponível
    if (window.focusApp && window.focusApp.showToast) {
      window.focusApp.showToast(message, type);
    } else {
      console.log(message);
    }
  }

  // Método para atualizar o ID da playlist
  updatePlaylist(playlistId) {
    if (this.youtubeIframe) {
      const currentSrc = this.youtubeIframe.src;
      const newSrc = currentSrc.replace(/list=[\w-]+/, `list=${playlistId}`);
      this.youtubeIframe.src = newSrc;
    }
  }

  // Método para configurações de volume e controles
  setVolume(volume) {
    if (this.youtubePlayer && this.youtubePlayer.setVolume) {
      try {
        this.youtubePlayer.setVolume(volume);
      } catch (error) {
        console.log("Erro ao ajustar volume:", error);
      }
    }
  }
}

// Disponibilizar globalmente
window.MusicManager = MusicManager;
