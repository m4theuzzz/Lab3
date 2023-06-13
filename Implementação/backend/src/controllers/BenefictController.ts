import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { BenefictRaw, processBenefict } from '../views/BenefictView';
import { Database } from '../modules/Database';

export const route = Router();
const service = new GenericService();

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const role = (await Database.findRole(Number(req.sessionID)))
        const querys = role == "partner" ? { ...req.query, user_id: req.sessionID } : req.query;
        const rawBeneficts = await service.select<BenefictRaw[]>(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BENEFICTS,
            querys
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!rawBeneficts) {
            return;
        }

        const beneficts = rawBeneficts.map(benefict => processBenefict(benefict));

        res.status(200).send(beneficts);
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        let err = null

        if (!req.body.value || req.body.value < 1) {
            res.status(400).send("Valor inválido.");
            return;
        }

        if (!req.body.description || req.body.description == "") {
            res.status(400).send("Descrição inválida.");
            return;
        }

        if (!req.body.photo || req.body.photo == "") {
            res.status(400).send("Descrição inválida.");
            return;
        }

        if (await Database.findRole(Number(req.sessionID)) !== "partner") {
            res.status(403).send("Você não possui permissão para realizar essa ação.");
            return;
        }

        const insertion = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BENEFICTS,
            { ...req.body, user_id: req.sessionID }
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        const insertedId = (await service.getLastInsertedItem(TablesNames.BENEFICTS))[0].id;

        if (insertion) {
            res.status(200).send({ message: "Benefício criado com sucesso.", id: insertedId });
        } else {
            res.status(401).send("Você não possui permissão para adicionar benefícios.");
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

        if (!req.body.value || req.body.value < 1) {
            res.status(400).send("Valor inválido.");
            return;
        }

        if (!req.body.description || req.body.description == "") {
            res.status(400).send("Descrição inválida.");
            return;
        }

        if (!req.body.photo || req.body.photo == "") {
            res.status(400).send("Descrição inválida.");
            return;
        }

        if (await Database.findRole(Number(req.sessionID)) !== "partner") {
            res.status(403).send("Você não possui permissão para realizar essa ação.");
            return;
        }

        const update = await service.update(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BENEFICTS,
            String(req.query.id),
            req.body
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Benefício atualizado com sucesso.");
        } else {
            res.status(401).send("O benefício solicitado não foi encontrado.");
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

        if (await Database.findRole(Number(req.sessionID)) !== "partner") {
            res.status(403).send("Você não possui permissão para realizar essa ação.");
            return;
        }

        const update = await service.remove(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BENEFICTS,
            String(req.query.id)
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Benefício removido com sucesso.");
        } else {
            res.status(404).send("O benefício solicitado não foi encontrado.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});
