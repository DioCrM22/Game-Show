🎮 Hero Battle Arena ⚔️
https://img.shields.io/badge/React-18.2.0-blue.svg
https://img.shields.io/badge/Node.js-16+-green.svg
https://img.shields.io/badge/PostgreSQL-15-blue.svg
https://img.shields.io/badge/License-MIT-yellow.svg

Uma arena de batalha épica onde heróis se enfrentam em combates estratégicos por turnos! Escolha seu herói, desenvolva estratégias e torne-se o campeão da arena.

https://via.placeholder.com/800x400/222/fff?text=Hero+Battle+Arena+Preview

✨ Características Principais
🎯 Sistema de Batalha por Turnos
3 tipos de ataques: Básico, Rápido e Especial

Sistema de precisão: Chance de acerto baseada na habilidade

Esquiva: Velocidade do defensor influencia na esquiva

Defesa: Redução de dano baseada na armadura

🦸 Sistema de Heróis
Atributos únicos: Vida, Defesa, Velocidade

Ataques personalizados: Dano e precisão específicos

Animações épicas: Gifs especiais para cada ação

Progressão: Sistema de vitórias e derrotas

⚡ Recursos Técnicos
Frontend React: Interface moderna e responsiva

Backend Node.js: API RESTful robusta

PostgreSQL: Armazenamento persistente de dados

WebSockets: Comunicação em tempo real (futuro)

🚀 Como Executar o Projeto
Pré-requisitos
bash
Node.js 16+ 
PostgreSQL 15+
npm ou yarn
📦 Instalação Backend
bash
# Clone o repositório
git clone https://github.com/seu-usuario/hero-battle-arena.git
cd hero-battle-arena/backend

# Instale as dependências
npm install

# Configure o banco de dados
cp .env.example .env
# Edite o .env com suas configurações do PostgreSQL

# Execute as migrations
npx sequelize-cli db:migrate

# Inicie o servidor
npm run dev
🎨 Instalação Frontend
bash
cd ../frontend

# Instale as dependências
npm install

# Configure a API URL
cp .env.example .env
# Edite o .env com a URL do backend

# Inicie a aplicação
npm start
🎮 Como Jogar
1. Seleção de Herói
Escolha entre diversos heróis com habilidades únicas

Cada herói possui atributos diferentes de vida, defesa e velocidade

2. Modos de Jogo
PVP: Enfrente outro jogador

PVE: Batalhe contra a CPU inteligente

3. Sistema de Turnos
javascript
// Exemplo de fluxo de jogo
Jogador 1 → Ataque Básico (←)
Jogador 2 → Ataque Rápido (→)
Jogador 1 → Ataque Especial (↑) - Requer 3 cargas
4. Controles
Jogador 1:

← Ataque Básico

→ Ataque Rápido

↑ Ataque Especial

Jogador 2:

A Ataque Básico

D Ataque Rápido

W Ataque Especial

🏗️ Estrutura do Projeto
text
hero-battle-arena/
├── backend/
│   ├── controllers/
│   │   └── battleController.js
│   ├── models/
│   │   ├── Player.js
│   │   ├── Hero.js
│   │   └── Battle.js
│   ├── routes/
│   │   └── battleRoutes.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── componentes/
│   │   │   └── BarraDeVida/
│   │   ├── paginas/
│   │   │   └── Batalha/
│   │   └── App.js
│   └── public/
└── README.md
🔧 API Endpoints
Batalha
POST /api/battle/start - Inicia nova batalha

POST /api/battle/turn - Executa turno de ataque

POST /api/battle/cpu-turn - Turno automático da CPU

GET /api/battle/status/:id - Status da batalha

GET /api/battle/history - Histórico de batalhas

Heróis
GET /api/heroes - Lista todos os heróis

GET /api/heroes/:id - Detalhes do herói

Jogadores
GET /api/players - Estatísticas dos jogadores

POST /api/players - Cria novo jogador

🎨 Tecnologias Utilizadas
Frontend
⚛️ React 18.2.0

🎨 CSS3 com animações

🎯 React Router DOM

⌨️ Suporte a teclado

Backend
🟢 Node.js + Express

🐘 PostgreSQL + Sequelize ORM

🔄 Sistema de batalha em tempo real

📊 Persistência de estatísticas

DevOps
📦 npm/yarn

🗄️ PostgreSQL

🔧 Scripts de migração

🌐 CORS configurado

🤝 Contribuindo
Faça o fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📝 Roadmap
🎭 Sistema de skins para heróis

🌐 Multiplayer online em tempo real

📊 Ranking global de jogadores

🎨 Mais animações e efeitos visuais

📱 Versão mobile responsive

🎵 Trilha sonora e efeitos sonoros

🏆 Torneios e eventos especiais

👥 Autores
Seu Nome - @seu-usuario

Contribuidores - Lista de contribuidores

📄 Licença
Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.

🙏 Agradecimentos
Ícones por FontAwesome

Inspirado em jogos clássicos de turno

Comunidade React Brasil

⭐️ Dê uma estrela no repositório se você gostou do projeto!

https://api.star-history.com/svg?repos=seu-usuario/hero-battle-arena&type=Date

🚀 Pronto para a batalha? Escolha seu herói e entre na arena agora mesmo!

https://img.shields.io/badge/Play-Now-brightgreen.svg https://img.shields.io/badge/Live-Demo-orange.svg