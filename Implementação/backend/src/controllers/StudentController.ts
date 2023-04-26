import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { processStudent, StudentRaw } from '../views/StudentView';
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
                userId: req.sessionID,
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

        const createStudents = await service.create(
            {
                userId: req.sessionID,
            },
            TablesNames.STUDENTS,
            { ...body, user_id: createdUserId, address_id: 1 }
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createStudents) {
            return;
        } else {
            const createdId = service.getLastInsertedItem(TablesNames.STUDENTS);
            res.status(200).send({ message: "Aluno criado com sucesso.", id: createdId });
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawStudents = (await service.select<StudentRaw[]>({
            userId: req.sessionID
        }, TablesNames.STUDENTS, req.query).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        const rawUsers = (await service.select<UserRaw[]>({
            userId: req.sessionID
        }, TablesNames.USERS, {}).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawStudents || !rawUsers) {
            return;
        }

        let user = rawStudents.map(student => {
            const processedStudent = processStudent(student);
            const studentUser = rawUsers.find(user => user.id == student.user_id)
            return { ...processedStudent, name: studentUser.name, email: studentUser.email }
        });

        return res.status(200).send(user);
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const updateStudents = await service.update({
            userId: req.sessionID,
        }, TablesNames.STUDENTS, String(req.query.id), req.body).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updateStudents) {
            return;
        }

        if (updateStudents.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para editar este usuário.");
        } else {
            res.status(200).send("Aluno atualizado com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const deleteStudents = await service.remove({
            userId: req.sessionID,
        }, TablesNames.STUDENTS, String(req.query.id)).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!deleteStudents) {
            return;
        }

        if (deleteStudents.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para remover este usuário.");
        } else {
            res.status(200).send("Aluno removido com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});
