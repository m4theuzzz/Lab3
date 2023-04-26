import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { processPartner, PartnerRaw } from '../views/PartnerView';
import { Security } from '../modules/Security';

export const route = Router();
const service = new GenericService();

route.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, password: Security.AESEncrypt(req.body.password) }

        const createPartners = await service.create(
            {
                userId: req.sessionID,
            },
            TablesNames.PARTNERS,
            body
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createPartners) {
            return;
        } else {
            const createdId = service.getLastInsertedItem(TablesNames.PARTNERS, req.sessionID);
            res.status(200).send({ message: "Parceiro criado com sucesso.", id: createdId });
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawPartners = (await service.select<PartnerRaw[]>({
            userId: req.sessionID
        }, TablesNames.PARTNERS, req.query).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawPartners) {
            return;
        }

        let user = processPartner(rawPartners[0]);

        return res.status(200).send(user);
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const updatePartners = await service.update({
            userId: req.sessionID,
        }, TablesNames.PARTNERS, String(req.query.id), req.body).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updatePartners) {
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
            userId: req.sessionID,
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
