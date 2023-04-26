import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { processUser, UserRaw } from '../views/UsersView';
import { Security } from '../modules/Security';

export const route = Router();
const service = new GenericService();

route.post('/', async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, password: Security.AESEncrypt(req.body.password) }

        const createUser = await service.create(
            {
                userId: req.sessionID,
            },
            TablesNames.USERS,
            { ...body, address_id: 1 }
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createUser) {
            return;
        } else {
            res.status(200).send({ message: "Usuário criado com sucesso." });
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawUsers = (await service.select<UserRaw[]>({
            userId: req.sessionID
        }, TablesNames.USERS, req.query).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawUsers) {
            return;
        }

        let user = processUser(rawUsers[0]);
        delete user['password'];
        return res.status(200).send(user);
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const updateUser = await service.update({
            userId: req.sessionID,
        }, TablesNames.USERS, String(req.query.id), req.body).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updateUser) {
            return;
        }

        if (updateUser.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para editar este usuário.");
        } else {
            res.status(200).send("Usuário atualizado com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const deleteUser = await service.remove({
            userId: req.sessionID,
        }, TablesNames.USERS, String(req.query.id)).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!deleteUser) {
            return;
        }

        if (deleteUser.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para remover este usuário.");
        } else {
            res.status(200).send("Usuário removido com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});
