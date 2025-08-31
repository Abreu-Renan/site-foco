# 🎯 Hora do Foco

_"Quando é hora de focar, cada minuto conta."_

Um aplicativo web moderno para técnica Pomodoro e gerenciamento de foco, desenvolvido com HTML, CSS e JavaScript vanilla.

## ✨ Funcionalidades

### ⏰ Timer Personalizado

- **Tempos predefinidos**: 5, 10, 15, 25 ou 30 minutos
- **Controles intuitivos**: Iniciar, pausar e resetar
- **Progresso visual**: Anel que se preenche gradualmente mostrando o tempo decorrido
- **Efeitos visuais**: Brilho sutil no anel quando o timer está ativo
- **Interface limpa**: Design focado na funcionalidade essencial

### 🎵 Música para Foco

- **Playlist integrada**: Player do YouTube com músicas relaxantes para concentração
- **Controles nativos**: Interface padrão do YouTube para melhor experiência
- **Independente**: Música funciona independentemente do timer
- **Volume ajustável**: Controles integrados do YouTube

### 🔔 Notificações Inteligentes

- **Modal moderno**: Popup elegante quando o timer termina
- **Som de conclusão**: Notificação sonora suave automática
- **Opções interativas**: Continuar focando, fazer pausa ou fechar
- **Animações suaves**: Efeitos visuais agradáveis

### 🎨 Design Moderno

- **Interface escura**: Design elegante e moderno
- **Responsivo**: Funciona em desktop, tablet e celular
- **Animações suaves**: Feedback visual agradável com efeitos de transição
- **Modal interativo**: Popup bonito ao completar sessões
- **Footer personalizado**: Créditos do desenvolvedor com links sociais
- **Minimalista**: Foco na funcionalidade principal

## 🚀 Como Usar

1. **Abra** o arquivo `index.html` no seu navegador
2. **Escolha** o tempo de foco desejado (5, 10, 15, 25 ou 30 minutos)
3. **Clique** em "Iniciar" para começar o timer
4. **Acompanhe** o progresso visual no anel que se preenche gradualmente
5. **Opcionalmente** inicie a música de foco para melhor concentração
6. **Foque** na sua tarefa até o timer completar
7. **Interaja** com o popup de conclusão para decidir os próximos passos
8. **Use** "Pausar" para interromper ou "Resetar" para reiniciar

## 🛠️ Estrutura do Projeto

```
Site Foco/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos e design
├── js/
│   ├── simple-timer.js     # Timer simplificado (ativo)
│   ├── timer.js            # Timer original (desabilitado)
│   ├── stats.js            # Estatísticas (desabilitado)
│   ├── youtube-sync.js     # Sincronização YouTube (desabilitado)
│   └── app.js              # Aplicação principal (desabilitado)
└── test-timer.html         # Arquivo de teste
```

## 🔧 Funcionalidades Técnicas

### Timer Avançado

- Inicialização robusta com verificação de elementos DOM
- Event listeners diretos para melhor performance
- Atualização em tempo real do display e progresso visual
- Gerenciamento de estado simples e confiável
- Progresso circular que se preenche conforme o tempo passa

### Experiência do Usuário

- Modal de conclusão com design moderno e animações
- Som de notificação usando Web Audio API
- Efeitos visuais sutis (brilho no anel ativo)
- Feedback imediato para todas as ações do usuário

### Interface Responsiva

- Layout adaptativo para diferentes tamanhos de tela
- Design mobile-first
- Controles touch-friendly
- Footer com links sociais responsivos

### Integração YouTube

- Player incorporado com playlist de foco
- Controles nativos do YouTube
- Funcionamento independente do timer

## ⌨️ Funcionalidades Atuais

| Ação                  | Como Usar                |
| --------------------- | ------------------------ |
| Iniciar/Pausar timer  | Clique no botão Play     |
| Resetar timer         | Clique no botão Reset    |
| Escolher tempo        | Clique nos presets       |
| Controlar música      | Use controles YouTube    |
| Ver progresso         | Observe o anel se encher |
| Após completar        | Interaja com o popup     |
| Acessar redes sociais | Clique nos links footer  |

## 🎯 Técnica Pomodoro

A técnica Pomodoro é um método de gerenciamento de tempo que usa intervalos de trabalho focado seguidos de pausas curtas:

1. **25 minutos** de foco intenso (ou tempo personalizado)
2. **5 minutos** de pausa
3. Repetir 4 ciclos
4. **15-30 minutos** de pausa longa

Este aplicativo facilita a implementação dessa técnica com timers personalizáveis de 5 a 30 minutos.

## 🌟 Funcionalidades Implementadas

- ✅ Timer funcional com presets personalizáveis
- ✅ Interface limpa e moderna
- ✅ Player de música integrado (YouTube)
- ✅ Design responsivo
- ✅ Progresso visual em tempo real (anel que se preenche)
- ✅ Controles intuitivos
- ✅ Modal de conclusão interativo
- ✅ Som de notificação automático
- ✅ Efeitos visuais e animações
- ✅ Footer com créditos e links sociais

## 🌟 Próximas Funcionalidades (Planejadas)

- [ ] Estatísticas de uso detalhadas
- [ ] Diferentes tipos de sessão (trabalho, estudo, exercício)
- [ ] Temas personalizáveis
- [ ] Modo offline completo
- [ ] Atalhos de teclado
- [ ] Histórico de sessões
- [ ] Integração com calendário
- [ ] Sons de notificação personalizados

## 💡 Dicas de Uso

### Para Melhor Foco

- **Silencie** as notificações do celular
- **Feche** abas desnecessárias do navegador
- **Tenha** água e lanches por perto
- **Defina** objetivos claros para cada sessão
- **Use** a música de foco para melhor concentração
- **Observe** o progresso visual do anel para motivação

### Para Melhor Experiência

- **Mantenha** a aba aberta durante o timer
- **Use** headphones para isolamento sonoro
- **Ajuste** o volume da música conforme preferir
- **Experimente** diferentes tempos de foco
- **Interaja** com o popup de conclusão para continuar produtivo
- **Permita** som no navegador para receber notificações

## 🔒 Privacidade

- **Dados locais**: Aplicação funciona inteiramente no navegador
- **Sem tracking**: Não coletamos nenhum dado pessoal
- **YouTube**: Música fornecida pelo player oficial do YouTube

## 🐛 Solução de Problemas

### Timer não funciona

- Verifique se o JavaScript está habilitado
- Atualize a página (F5)
- Abra o console do desenvolvedor para verificar erros

### Música não carrega

- Verifique sua conexão com a internet
- O YouTube pode estar bloqueado em sua rede
- Tente recarregar a página

### Som de notificação não toca

- Permita áudio no navegador (clique no ícone de som na barra de endereços)
- Verifique se o volume do sistema não está no mudo
- Alguns navegadores bloqueiam áudio automático até interação do usuário

### Modal não aparece

- Aguarde o timer completar naturalmente
- Verifique se não há bloqueadores de popup ativos
- Recarregue a página se necessário

### Interface não responde

- Aguarde alguns segundos após carregar a página
- Verifique se todos os elementos carregaram completamente
- Tente em modo incógnito para descartar extensões

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

**Desenvolvido com ❤️ por Renan para maximizar sua produtividade!**

_Conecte-se comigo:_

- 🐙 [GitHub](https://github.com/seu-usuario)
- 💼 [LinkedIn](https://linkedin.com/in/seu-perfil)
