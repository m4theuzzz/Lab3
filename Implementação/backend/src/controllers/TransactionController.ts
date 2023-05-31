import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { TransactionRaw, processTransaction } from '../views/TransactionView';
import { TransactionService } from '../services/TransactionService';
import { AccessView } from '../views/AccessView';
import { StudentRaw } from '../views/StudentView';
import { RequestException } from '../views/RequestExceptionView';
import { UserRaw } from '../views/UsersView';

export const route = Router();
const service = new GenericService();
const operations = new TransactionService();

export async function getTargetNewBalance(access: AccessView, targetId: number, transaction: TransactionRaw, tableName: TablesNames): Promise<number> {
    const target = (await service.select<StudentRaw[]>(
        access,
        tableName,
        { user_id: targetId }
    ))[0];

    if (!target) {
        throw { status: 404, message: "Destinatário não encontrado" } as RequestException;
    }

    let value = 0;
    if (transaction.type == "credit") {
        value = Number(target.balance) + Number(transaction.value);
    } else {
        value = Number(target.balance) - Number(transaction.value);
    }

    if (value < 0) {
        throw { status: 400, message: "Operação inválida. Não há creditos suficientes." } as RequestException;
    }

    return value;
}

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const role = req.params.role;

        const queryObject = role === "student" ? { ...req.query, target: req.sessionID } : { ...req.query, origin: req.sessionID }

        const rawTransactions = await service.select<TransactionRaw[]>(
            {
                userId: Number(req.sessionID),
                role: role
            },
            TablesNames.TRANSACTIONS,
            queryObject
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!rawTransactions) {
            return;
        }

        const rawUsers = (await service.select<UserRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.USERS, {}).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawUsers) {
            return;
        }

        const transactions = rawTransactions.map(transaction => {
            const user = rawUsers.find(u => filter(role, transaction.origin, transaction.target, u.id));
            return { ...processTransaction(transaction), ...user }
        });

        res.status(200).send(transactions);
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

        const insertion = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.TRANSACTIONS,
            { ...req.body, origin: Number(req.sessionID) }
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        const insertedId = (await service.getLastInsertedItem(TablesNames.TRANSACTIONS))[0].id;
        const access = { userId: Number(req.sessionID) };

        const targetValue = await getTargetNewBalance(access, req.body.target, req.body, TablesNames.STUDENTS);
        const originValue = await getTargetNewBalance(access, access.userId, { ...req.body, type: "debit" }, TablesNames.TEACHERS);

        await operations.transfer(access, req.body.target, targetValue, originValue)

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
                role: req.params.role
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
                role: req.params.role
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
            res.status(404).send("A transação solicitada não foi encontrada.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

function filter(role: string, origin: number, target: number, test: number): boolean {
    if (role === 'student') {
        return origin === test
    } else {
        return target === test
    }
}
