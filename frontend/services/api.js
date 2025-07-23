import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 segundos
  withCredentials: true, // Para enviar cookies/tokens
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptores para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erros 4xx/5xx
      console.error('Erro na resposta:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro na configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;