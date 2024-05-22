const utils = require('../../../utils');
const nodemailer = require('nodemailer');


exports.enviarEmail = async (req, res, next) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "philippegabriel680@gmail.com",
                pass: "qkft meau xtsw lmeq",
            },
        });
        
        const mailOptions = {
            from: 'Equipe Kratos Fit" <philippegabriel680@gmail.com>',
            to: req.body.destino,
            subject: "Código de recuperação de senha",
            html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Código de recuperação de senha</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f8f8;
                    }
        
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
        
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
        
                    .header h2 {
                        color: #333;
                    }
        
                    .content {
                        margin-bottom: 20px;
                    }
        
                    .footer {
                        text-align: center;
                        color: #666;
                    }
        
                    .footer a {
                        color: #333;
                        text-decoration: none;
                    }
                </style>
            </head>
                <body>
                <div class="container">
                    <div class="header">
                        <h2>Relatório de Serviço</h2>
                    </div>
                    <div class="content">
                        <p>Prezado(a) Cliente! Esperamos que esteja tudo certo com o mesmo.</p>
                        <p>Recebemos uma solicitação de recuperação de senha para a sua conta. Para redefinir a sua senha, preencha os campos que o aplicativo está mandando para iniciar sua sessão de alteração de senha.</p>
                        <br></br>
                        <p>123123423</p>
                        <br></br>
                        <p>Se você não solicitou esta alteração, por favor entre em contato conosco imediatamente!</p>
                        <br></br>
                        <p>Atenciosamente, Equipe Kratos Fit</p>
                    </div>
                    <div class="footer">
                        <p>Este e-mail foi enviado automaticamente. Por favor, não responda diretamente a este e-mail!</p>
                    </div>
                </div>
                </body>
            </html>
            `,
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                return res.status(500).send({ message: 'Erro ao enviar email!', error : error });
            } else {
                return res.status(200).send({ message: 'Email enviado com sucesso!' });
            }
        });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}