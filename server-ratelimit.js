const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 8080;

// Middleware de rate limiting (Limite de 100 requisições por minuto)
const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minuto
    max: 100,  // Limite de 100 requisições
    message: 'Você excedeu o limite de requisições, tente novamente mais tarde.',
});

app.use(limiter);

// Função simulando a chamada externa
async function externalService() {
    return 'Resposta da chamada externa';
}

// Função para simular múltiplas requisições
function simulateRequests() {
    for (let i = 0; i < 105; i++) {
        fetch('http://localhost:8080/api/ratelimit')
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.log('Erro:', error));
    }
}

// Rota para simular o rate limit
app.get('/api/ratelimit', async (req, res) => {
    try {
        const result = await externalService();
        res.send(result);
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    simulateRequests();  // Chamando a função para simular o erro
});
