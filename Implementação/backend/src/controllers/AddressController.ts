import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { AddressRaw, processAddress } from '../views/AddressView';

export const route = Router();
const service = new GenericService();

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawAddresses = await service.select<AddressRaw[]>(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.ADDRESSES,
            req.query
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!rawAddresses) {
            return;
        }

        const addresses = rawAddresses.map(address => processAddress(address));

        res.status(200).send(addresses);
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        let err = null
        const insertion = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.ADDRESSES,
            req.body
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        if (insertion) {
            const insertedId = await service.getLastInsertedItem(TablesNames.ADDRESSES);
            res.status(200).send({ message: "Endereço criado com sucesso.", id: insertedId[0].id });
        } else {
            res.status(401).send("Você não possui permissão para adicionar endereços.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            return res.status(400).send("O ID do usuário precisar ser passado como parâmetro na query.");
        }
        const update = await service.update(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.ADDRESSES,
            String(req.query.id),
            req.body
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Endereço atualizado com sucesso.");
        } else {
            res.status(401).send("O endereço solicitado não foi encontrado.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            return res.status(400).send("O ID do usuário precisar ser passado como parâmetro na query.");
        }
        const update = await service.remove(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.ADDRESSES,
            String(req.query.id)
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Endereço removido com sucesso.");
        } else {
            res.status(401).send("O endereço solicitado não foi encontrado.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});
