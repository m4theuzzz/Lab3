import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';

const { authenticate } = AuthService;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.headers["session-token"]) {
        try {
            const sessionToken = req.headers['session-token'];
            const { userId, role } = await authenticate(sessionToken);
            req.sessionID = String(userId);
            req.params.role = role;
            next();
        } catch (error) {
            res.status(403).send("Token Inválido.");
        }
    } else {
        res.status(403).send("Token de autenticação não recebido.");
    }
}
