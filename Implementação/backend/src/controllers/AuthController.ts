import { Request, Response, Router, urlencoded } from 'express';
import AuthService from '../services/AuthService';
import { Security } from '../modules/Security';

const { authorize, authenticate } = AuthService;

export const route = Router();

route.post('/login', urlencoded({ extended: false }), (req: Request, res: Response) => {
    req.session.regenerate(async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send("Não foi possível iniciar a sessão");
        }

        if (!req.body.email || !req.body.password) {
            return res.status(400).send("Requisição não possui os dados necessários");
        }

        try {
            const sessionToken = await authorize(req.body.email, req.body.password);

            req.session.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Não foi possível iniciar a sessão");
                } else {
                    res.status(200).send(sessionToken);
                }
            })
        } catch (error) {
            res.status(error.status || 500).send(error.message);
        }
    });
});

route.post('/refresh', urlencoded({ extended: false }), async (req: Request, res: Response) => {
    if (!req.headers['session-token']) {
        return res.status(400).send("Token de autenticação não recebido.");
    }

    try {
        await authenticate(req.headers['session-token']);
        const userData = Security.JWTDecrypt(req.headers['session-token'] as string);
        res.status(200).send(await authorize(userData.email, Security.AESDecrypt(userData.password)));
    } catch (error) {
        res.status(500).send(error.message);
    }
});
