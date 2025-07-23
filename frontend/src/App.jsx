import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CriarJogador from './pages/CriarJogador/CriarJogador';
import SelecionarPersonagem from './pages/SelecionarPersonagem/SelecionarPersonagem';
import Batalha from './pages/Batalha/Batalha';
import Resultado from './pages/Resultado/Resultado';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar-jogador" element={<CriarJogador />} />
        <Route path="/selecionar-personagem" element={<SelecionarPersonagem />} />
        <Route path="/batalha" element={<Batalha />} />
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </Router>
  );
}