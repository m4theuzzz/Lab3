import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { BoughtBenefitRaw, processBoughtBenefit } from '../views/BoughtBenefitView';
import { Database } from '../modules/Database';
import { getTargetNewBalance } from './TransactionController';
import { TransactionService } from '../services/TransactionService';
import { MailerService } from '../services/MailerService';
import { StudentRaw } from '../views/StudentView';
import { Email } from '../views/EmailView';
import { UserRaw } from '../views/UsersView';
import { BenefitRaw } from '../views/BenefitView';

export const route = Router();
const service = new GenericService();
const operations = new TransactionService();

route.get('/bought', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawBoughtBenefits = await service.select<BoughtBenefitRaw[]>(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BOUGHT_Benefits,
            { user_id: req.sessionID }
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        const rawBenefits = await service.select<BenefitRaw[]>(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.Benefits,
            {}
        );

        if (!rawBoughtBenefits || !rawBenefits) {
            return;
        }

        const boughtBenefits = rawBoughtBenefits.map(boughtBenefit => {
            const benefit = rawBenefits.find(b => b.id === boughtBenefit.benefit_id);
            return {
                ...processBoughtBenefit(boughtBenefit),
                photo: benefit?.photo,
                description: benefit?.description
            }
        });

        res.status(200).send(boughtBenefits);
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.post('/buy', authMiddleware, async (req: Request, res: Response) => {
    try {
        let err = null

        if (await Database.findRole(Number(req.sessionID)) !== "student") {
            res.status(403).send("Você não possui permissão para realizar essa ação.");
            return;
        }

        const access = { userId: Number(req.sessionID) };
        const newBalance = await getTargetNewBalance(access, access.userId, { ...req.body, type: "debit" }, TablesNames.STUDENTS);
        const insertion = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BOUGHT_Benefits,
            { ...req.body, user_id: req.sessionID }
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        const postTransaction = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.TRANSACTIONS,
            {
                origin: Number(req.sessionID),
                target: Number(req.sessionID),
                value: Number(req.body.value),
                type: 'benefit',
                description: 'Compra do benefício'
            }
        ).catch(error => {
            err = error
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (err) {
            return;
        }

        await operations.buy(access, access.userId, newBalance);

        const insertedId = (await service.getLastInsertedItem(TablesNames.BOUGHT_Benefits))[0].id;

        const user = (await service.select<UserRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.USERS, { id: access.userId }))[0];

        const email: Email = {
            to: user.email,
            subject: "Compra de Benefício",
            text: `O benefício (${req.body.benefit_id}) foi comprado com sucesso. Seu identificador único é: ${insertedId}`
        }

        MailerService.sendEmail(email);

        if (insertion) {
            res.status(200).send({ message: "Benefício criado com sucesso.", id: insertedId });
        } else {
            res.status(401).send("Você não possui permissão para adicionar benefícios.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/refund', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            return res.status(400).send("O ID do usuário precisar ser passado como parâmetro na query.");
        }

        if (await Database.findRole(Number(req.sessionID)) !== "student") {
            res.status(403).send("Você não possui permissão para realizar essa ação.");
            return;
        }

        const access = { userId: Number(req.sessionID) };
        const newBalance = await getTargetNewBalance(access, access.userId, { ...req.body, type: "credit" }, TablesNames.STUDENTS);

        const deleted = await service.remove(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.BOUGHT_Benefits,
            String(req.query.id)
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!deleted) {
            return;
        }

        await operations.buy(access, access.userId, newBalance);

        if (deleted.affectedRows > 0) {
            res.status(200).send("Benefício removido com sucesso.");
        } else {
            res.status(404).send("O benefício solicitado não foi encontrado.");
        }
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
});
