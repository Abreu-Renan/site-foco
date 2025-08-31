class StatsManager {
  constructor() {
    this.sessionsCompleted = 0;
    this.totalFocusTime = 0; // em minutos
    this.currentStreak = 0;
    this.lastSessionDate = null;

    // Elementos do DOM
    this.sessionsElement = document.getElementById("sessions-completed");
    this.totalTimeElement = document.getElementById("total-focus-time");
    this.streakElement = document.getElementById("current-streak");

    this.loadStats();
    this.updateDisplay();
  }

  addCompletedSession(minutes) {
    this.sessionsCompleted++;
    this.totalFocusTime += minutes;

    // Verificar se é do mesmo dia para manter a sequência
    const today = new Date().toDateString();
    if (this.lastSessionDate === today) {
      this.currentStreak++;
    } else {
      this.currentStreak = 1;
    }

    this.lastSessionDate = today;

    this.saveStats();
    this.updateDisplay();
    this.showCompletionAnimation();
  }

  updateDisplay() {
    this.sessionsElement.textContent = this.sessionsCompleted;
    this.totalTimeElement.textContent = `${this.totalFocusTime}min`;
    this.streakElement.textContent = this.currentStreak;
  }

  showCompletionAnimation() {
    // Animar o número de sessões
    this.sessionsElement.style.transform = "scale(1.2)";
    this.sessionsElement.style.color = "var(--success-color)";

    setTimeout(() => {
      this.sessionsElement.style.transform = "scale(1)";
      this.sessionsElement.style.color = "var(--primary-color)";
    }, 500);

    // Animar o tempo total
    setTimeout(() => {
      this.totalTimeElement.style.transform = "scale(1.1)";
      this.totalTimeElement.style.color = "var(--success-color)";

      setTimeout(() => {
        this.totalTimeElement.style.transform = "scale(1)";
        this.totalTimeElement.style.color = "var(--primary-color)";
      }, 300);
    }, 200);

    // Animar a sequência
    setTimeout(() => {
      this.streakElement.style.transform = "scale(1.1)";
      this.streakElement.style.color = "var(--success-color)";

      setTimeout(() => {
        this.streakElement.style.transform = "scale(1)";
        this.streakElement.style.color = "var(--primary-color)";
      }, 300);
    }, 400);
  }

  saveStats() {
    const stats = {
      sessionsCompleted: this.sessionsCompleted,
      totalFocusTime: this.totalFocusTime,
      currentStreak: this.currentStreak,
      lastSessionDate: this.lastSessionDate,
      savedDate: new Date().toDateString(),
    };

    localStorage.setItem("focusTimerStats", JSON.stringify(stats));
  }

  loadStats() {
    try {
      const savedStats = localStorage.getItem("focusTimerStats");
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        const today = new Date().toDateString();

        // Se é um novo dia, resetar as estatísticas diárias
        if (stats.savedDate !== today) {
          this.resetDailyStats();
        } else {
          this.sessionsCompleted = stats.sessionsCompleted || 0;
          this.totalFocusTime = stats.totalFocusTime || 0;
          this.currentStreak = stats.currentStreak || 0;
          this.lastSessionDate = stats.lastSessionDate;
        }
      }
    } catch (error) {
      console.log("Erro ao carregar estatísticas:", error);
      this.resetDailyStats();
    }
  }

  resetDailyStats() {
    this.sessionsCompleted = 0;
    this.totalFocusTime = 0;
    this.currentStreak = 0;
    this.lastSessionDate = null;
    this.saveStats();
  }

  exportStats() {
    const stats = {
      date: new Date().toLocaleDateString("pt-BR"),
      sessionsCompleted: this.sessionsCompleted,
      totalFocusTime: this.totalFocusTime,
      currentStreak: this.currentStreak,
    };

    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `foco-timer-stats-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  }

  // Método para obter conquistas baseadas nas estatísticas
  getAchievements() {
    const achievements = [];

    if (this.sessionsCompleted >= 1) {
      achievements.push({
        title: "Primeiro Foco",
        description: "Complete sua primeira sessão",
        icon: "🎯",
        unlocked: true,
      });
    }

    if (this.sessionsCompleted >= 5) {
      achievements.push({
        title: "Dedicado",
        description: "Complete 5 sessões em um dia",
        icon: "💪",
        unlocked: true,
      });
    }

    if (this.sessionsCompleted >= 10) {
      achievements.push({
        title: "Máquina de Foco",
        description: "Complete 10 sessões em um dia",
        icon: "🔥",
        unlocked: true,
      });
    }

    if (this.currentStreak >= 3) {
      achievements.push({
        title: "Em Sequência",
        description: "Mantenha uma sequência de 3 sessões",
        icon: "⚡",
        unlocked: true,
      });
    }

    if (this.totalFocusTime >= 60) {
      achievements.push({
        title: "Hora de Foco",
        description: "Acumule 60 minutos de foco",
        icon: "⏰",
        unlocked: true,
      });
    }

    if (this.totalFocusTime >= 120) {
      achievements.push({
        title: "Maratonista",
        description: "Acumule 2 horas de foco",
        icon: "🏃‍♂️",
        unlocked: true,
      });
    }

    return achievements;
  }

  // Método para obter insights das estatísticas
  getInsights() {
    const insights = [];

    if (this.sessionsCompleted > 0) {
      const avgSessionTime = this.totalFocusTime / this.sessionsCompleted;
      insights.push(
        `Tempo médio por sessão: ${avgSessionTime.toFixed(1)} minutos`
      );
    }

    if (this.currentStreak >= 3) {
      insights.push(
        `Excelente! Você está em uma sequência de ${this.currentStreak} sessões!`
      );
    }

    if (this.totalFocusTime >= 60) {
      const hours = Math.floor(this.totalFocusTime / 60);
      const minutes = this.totalFocusTime % 60;
      insights.push(`Você focou por ${hours}h ${minutes}min hoje. Incrível!`);
    }

    return insights;
  }
}

// Disponibilizar globalmente
window.StatsManager = StatsManager;
