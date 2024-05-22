const mysql = require('../../../mysql');
const bcrypt = require('bcrypt');
const utils = require('../../../utils');
const api_config = require('../../../utils').getApiConfig();
const jwt = require('jsonwebtoken');

exports.verificarClientes = async (req, res, next) => {
    try {
        const verificarClientes = await mysql.execute(
            `SELECT id_cliente FROM clientes WHERE cpf = ?;`,
            [req.body.email]
        );
        if (verificarClientes.length >= 1) {
            res.locals.id_cliente = verificarClientes[0].id_cliente;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.getDadosClientes = async (req, res, next) => {
    try {
        if (res.locals.id_cliente) {
            const dadosClientes = await mysql.execute(
                `SELECT id_cliente, 
                    nome,
                    email,
                    senha,
                    dt_criacao
               FROM clientes 
              WHERE id_cliente = ?`,
                [res.locals.id_cliente]
            );
            res.locals.clientes = dadosClientes[0];
            next();
        } else {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarClientes = async (req, res) => {
    try {
        if (!res.locals.id_cliente) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            await mysql.execute(`
                INSERT INTO clientes (
                            nome,
                            email,
                            cpf,
                            data_nascimento,
                            nacionalidade,
                            ddd,
                            telefone,
                            senha
                        ) VALUES (?,?,?,?,?,?,?,?);`,
                [
                    req.body.nome,
                    req.body.email,
                    req.body.cpf,
                    req.body.data_nascimento,
                    req.body.nacionalidade,
                    req.body.ddd,
                    req.body.telefone,
                    hash
                ]
            );
            return res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
        } else {
            return res.status(409).send({ message: 'Cliente já está cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarCartao = async (req, res) => {
    try {
        const cartaoExistente = await mysql.execute(`
    SELECT * FROM registrar_cartoes 
    WHERE digitos_cartao = ? AND cvv_cartao = ?;`,
            [req.body.digitos_cartao, req.body.cvv_cartao]
        );

        if (cartaoExistente.length > 0) {
            return res.status(400).send({ error: "Cartão já está registrado no sistema!" });
        }
        await mysql.execute(`
            INSERT INTO registrar_cartoes (
                digitos_cartao,
                bandeira_cartao,
                titular_cartao,
                vencimento_cartao,
                cvv_cartao,
                cep,
                endereco_cobranca,
                complemento,
                bairro,
                cidade,
                uf
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`,
            [
                req.body.digitos_cartao,
                req.body.bandeira_cartao,
                req.body.titular_cartao,
                req.body.vencimento_cartao,
                req.body.cvv_cartao,
                req.body.cep,
                req.body.endereco_cobranca,
                req.body.complemento,
                req.body.bairro,
                req.body.cidade,
                req.body.uf
            ]
        );

        await mysql.execute(`
        UPDATE clientes 
        SET id_cartao = ?
        WHERE id_cliente = ?;`, [
            cartao['insertId'],
            res.locals.id_cliente
        ])

        return res.status(201).send({ message: 'Cartão registrado no sistema com sucesso!' });
    } catch (error) {

        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.login = async (req, res) => {
    if (res.locals.clientes.length < 1) {
        return res.status(401).send({ message: 'Cliente cadastrado!' });
    }

    try {
        const match = await bcrypt.compare(req.body.senha, res.locals.clientes.senha)

        if (match) {
            const token = jwt.sign({
                email: res.locals.clientes.email,
                id_cliente: res.locals.clientes.id_cliente,
                nome: res.locals.clientes.nome,
            }, api_config.jwt_key);
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                id_cliente: res.locals.clientes.id_cliente,
                nome: res.locals.clientes.nome,
                email: res.locals.clientes.email,
                token: token,
            });
        } else {
            return res.status(401).send({ message: 'Senha incorreta. Digite sua senha certa!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.atualizarSenhaClientes = async (req, res, next) => {
    try {
        if (res.locals.id_cliente) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            const resultado = await mysql.execute(`
                UPDATE clientes 
                SET email = ?,
                    telefone = ?,
                    senha = ?
                WHERE cpf = ?;
            `, [req.body.email, req.body.telefone, hash, req.body.cpf]);
            return res.status(200).send({
                message: 'Atualizado com sucesso!',
                resultado: resultado
            });
        } else {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }


    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}  
