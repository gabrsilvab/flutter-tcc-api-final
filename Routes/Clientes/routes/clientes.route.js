const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');
const login = require('../middleware/login.middleware');

router.post(
    '/cadastro',
    clientesController.verificarClientes,
    clientesController.registrarClientes
);

router.post(
    '/cadastroCartao',
    login.required,
    clientesController.verificarClientes,
    clientesController.registrarCartao
);

router.post(
    '/login',
    clientesController.verificarClientes,
    clientesController.getDadosClientes,
    clientesController.login
);

router.put(
    '/esqueciSenha',
    login.required,
    clientesController.verificarClientes,
    clientesController.atualizarSenhaClientes
);

module.exports = router;