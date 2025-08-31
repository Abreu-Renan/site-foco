class YoutubeSync {
  constructor() {
    this.youtubePlayer = null;
    this.isPlayerReady = false;

    this.initializeYouTubeAPI();
  }

  initializeYouTubeAPI() {
    // Verificar se a API do YouTube já está carregada
    if (window.YT && window.YT.Player) {
      this.createPlayer();
    } else {
      // Carregar a API do YouTube
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Callback global quando a API estiver pronta
      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    }
  }

  createPlayer() {
    try {
      this.youtubePlayer = new YT.Player("youtube-player", {
        events: {
          onReady: (event) => {
            this.isPlayerReady = true;
            console.log("Player do YouTube pronto para sincronização!");
          },
          onError: (event) => {
            console.log("Erro no player do YouTube:", event.data);
          },
        },
      });
    } catch (error) {
      console.log("Erro ao criar player do YouTube:", error);
    }
  }

  // Método para iniciar o vídeo quando o timer começar
  startWithTimer() {
    if (this.isPlayerReady && this.youtubePlayer) {
      try {
        this.youtubePlayer.playVideo();
        this.showNotification("🎵 Música iniciada junto com o timer!");
      } catch (error) {
        console.log("Erro ao iniciar vídeo:", error);
        this.showNotification(
          "⚠️ Use o botão play do YouTube para iniciar a música"
        );
      }
    } else {
      this.showNotification(
        "⚠️ Player ainda carregando. Use o botão play do YouTube"
      );
    }
  }

  // Método para pausar o vídeo quando o timer pausar
  pauseWithTimer() {
    if (this.isPlayerReady && this.youtubePlayer) {
      try {
        this.youtubePlayer.pauseVideo();
        this.showNotification("⏸️ Música pausada junto com o timer");
      } catch (error) {
        console.log("Erro ao pausar vídeo:", error);
      }
    }
  }

  // Método para continuar o vídeo quando o timer continuar
  resumeWithTimer() {
    if (this.isPlayerReady && this.youtubePlayer) {
      try {
        this.youtubePlayer.playVideo();
        this.showNotification("▶️ Música retomada junto com o timer");
      } catch (error) {
        console.log("Erro ao retomar vídeo:", error);
      }
    }
  }

  // Verificar se o vídeo está tocando
  isPlaying() {
    if (this.isPlayerReady && this.youtubePlayer) {
      try {
        const state = this.youtubePlayer.getPlayerState();
        return state === YT.PlayerState.PLAYING;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  // Mostrar notificação
  showNotification(message) {
    if (window.focusApp && window.focusApp.showToast) {
      window.focusApp.showToast(message, "info");
    } else {
      console.log(message);
    }
  }
}

// Disponibilizar globalmente
window.YoutubeSync = YoutubeSync;
