import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { TransactionRaw, processTransaction } from '../views/TransactionView';
import { TransactionService } from '../services/TransactionService';

export const route = Router();
const service = new GenericService();
const operations = new TransactionService();

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawTransactions = await service.select<TransactionRaw[]>(
            {
                userId: Number(req.sessionID),
            },
            TablesNames.TRANSACTIONS,
            req.query
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!rawTransactions) {
            return;
        }

        const transactions = rawTransactions.map(transaction => processTransaction(transaction));

        res.status(200).send(transactions);
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
            },
            TablesNames.TRANSACTIONS,
            req.body
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        const insertedId = (await service.getLastInsertedItem(TablesNames.TRANSACTIONS))[0].id;

        await operations.transfer({ userId: Number(req.sessionID) }, req.body)

        if (insertion) {
            res.status(200).send({ message: "Transação criada com sucesso.", id: insertedId });
        } else {
            res.status(401).send("Você não possui permissão para adicionar transações.");
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
            },
            TablesNames.TRANSACTIONS,
            String(req.query.id),
            req.body
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Transação atualizado com sucesso.");
        } else {
            res.status(401).send("A transação solicitada não foi encontrada.");
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
            },
            TablesNames.TRANSACTIONS,
            String(req.query.id)
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!update) {
            return;
        }

        if (update.affectedRows > 0) {
            res.status(200).send("Transação removida com sucesso.");
        } else {
            res.status(401).send("A transação solicitada não foi encontrada.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});
