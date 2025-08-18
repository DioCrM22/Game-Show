🎮 Game Show - Sistema de Batalha de Heróis
https://prints/banner.jpg

Game Show é uma plataforma interativa de batalhas entre heróis, desenvolvida com React.js e Node.js, que permite duelos emocionantes entre jogadores ou contra a CPU.

🌟 Recursos Principais
👥 Modos Singleplayer e Multiplayer

🦸 Seleção de personagens com atributos únicos

⚔️ Sistema de batalha por turnos com 3 tipos de ataques

🏆 Tela de resultados com estatísticas detalhadas

🎨 Interface responsiva e imersiva

🛠 Tecnologias Utilizadas
Frontend
Tecnologia	Descrição
https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB	Biblioteca JavaScript para construção de UI
https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white	Roteamento entre páginas
https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white	Estilização avançada
Backend
Tecnologia	Descrição
https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white	Ambiente de execução JavaScript
https://img.shields.io/badge/Express.js-404D59?style=for-the-badge	Framework para API REST
Banco de Dados
Tecnologia	Descrição
https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white	Armazenamento de dados
🖼 Screenshots
<div align="center"> <img src="prints/login.jpg" width="30%" alt="Tela de Login"> <img src="prints/selecao.jpg" width="30%" alt="Seleção de Personagens"> <img src="prints/batalha.jpg" width="30%" alt="Tela de Batalha"> </div>
🚀 Como Executar
Pré-requisitos
Node.js (v16+)

MySQL (v8.0+)

npm ou yarn

Instalação
Clonar o repositório

bash
git clone https://github.com/seu-usuario/game-show.git
cd game-show
Configurar banco de dados

bash
mysql -u root -p < database/schema.sql
Instalar dependências

bash
cd frontend && npm install
cd ../backend && npm install
Configurar variáveis de ambiente
Crie um arquivo .env no diretório backend:

env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=game_show
Iniciar aplicação

bash
# Backend
cd backend && npm start

# Frontend (em outro terminal)
cd frontend && npm start
🎮 Fluxo do Jogo
Criação de Jogadores

Defina nomes e modo de jogo

Validação inteligente de nomes

Seleção de Heróis

Escolha entre diversos personagens

Visualize estatísticas detalhadas

Batalha

Sistema de turnos dinâmico

3 tipos de ataques com efeitos visuais

Barra de especial carregável

Resultados

Análise pós-batalha

Opções para revanche ou novo jogo

👥 Colaboradores
<table> <tr> <td align="center"> <a href="https://github.com/DioCrM22"> <img src="https://avatars.githubusercontent.com/u/SEU_USER_ID?v=4" width="100px;" alt="Diogo Cruz Maia"/> <br /> <sub><b>Diogo Cruz Maia</b></sub> </a> <br /> <span>Frontend & Game Design</span> </td> <td align="center"> <a href="https://github.com/SEU_COLABORADOR"> <img src="https://avatars.githubusercontent.com/u/USER_ID_COLABORADOR?v=4" width="100px;" alt="Gabriel Paulino"/> <br /> <sub><b>Gabriel Paulino</b></sub> </a> <br /> <span>Backend & Database</span> </td> </tr> </table>