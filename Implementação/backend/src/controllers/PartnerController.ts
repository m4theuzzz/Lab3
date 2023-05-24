import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { processPartner, PartnerRaw } from '../views/PartnerView';
import { Security } from '../modules/Security';
import { UserRaw } from '../views/UsersView';

export const route = Router();
const service = new GenericService();

route.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, password: Security.AESEncrypt(req.body.password) }
        const userBody = { ...body }

        const createUser = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.USERS,
            userBody
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createUser) {
            return;
        }

        const createdUserId = (await service.getLastInsertedItem(TablesNames.USERS))[0].id;

        const createPartners = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.PARTNERS,
            { ...body, user_id: createdUserId }
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createPartners) {
            return;
        } else {
            const createdId = (await service.getLastInsertedItem(TablesNames.PARTNERS))[0].id;
            res.status(200).send({ message: "Parceiro criado com sucesso.", id: createdId });
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawPartners = (await service.select<PartnerRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.PARTNERS, req.query).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        const rawUsers = (await service.select<UserRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.USERS, {}).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawPartners || !rawUsers) {
            return;
        }

        let user = rawPartners.map(partner => {
            const processedPartner = processPartner(partner);
            const studentUser = rawUsers.find(user => user.id == partner.user_id)
            return { ...processedPartner, name: studentUser.name, email: studentUser.email }
        });

        return res.status(200).send(user);
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const userBody = { ...body, id: body.userId, password: Security.AESEncrypt(body.password) }

        const updatePartners = await service.update({
            userId: Number(req.sessionID),
        }, TablesNames.PARTNERS, String(req.query.id), body).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updatePartners) {
            return;
        }

        const updateUser = await service.update({
            userId: Number(req.sessionID),
        }, TablesNames.USERS, userBody.id, userBody).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updateUser) {
            return;
        }

        if (updatePartners.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para editar este usuário.");
        } else {
            res.status(200).send("Parceiro atualizado com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const deletePartners = await service.remove({
            userId: Number(req.sessionID),
        }, TablesNames.PARTNERS, String(req.query.id)).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!deletePartners) {
            return;
        }

        if (deletePartners.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para remover este usuário.");
        } else {
            res.status(200).send("Parceiro removido com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});
