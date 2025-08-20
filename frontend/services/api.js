import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptores melhorados
api.interceptors.response.use(
  response => {
    // Padroniza resposta de sucesso
    if (response.data && !response.data.success) {
      console.warn('Resposta sem formato padrão:', response.data);
    }
    return response;
  },
  error => {
    // Tratamento detalhado de erros
    const errorData = {
      config: error.config,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };

    console.error('Erro na requisição:', errorData);
    
    // Transforma em erro padrão da aplicação
    const apiError = new Error(errorData.message || 'Erro na requisição');
    apiError.details = errorData;
    
    return Promise.reject(apiError);
  }
);

// Métodos auxiliares
api.handleError = (error) => {
  console.error('Erro tratado:', error.details || error.message);
  return {
    success: false,
    error: error.details?.data?.error || 'Erro na comunicação com o servidor'
  };
};

export default api;