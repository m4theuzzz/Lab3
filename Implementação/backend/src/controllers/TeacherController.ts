import { Request, Response, Router } from 'express';
import GenericService from '../services/GenericService';
import { authMiddleware } from '../modules/Midleware';
import { TablesNames } from '../views/QueryBuildView';
import { processTeacher, TeacherRaw } from '../views/TeacherView';
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

        const createTeachers = await service.create(
            {
                userId: Number(req.sessionID),
                role: req.params.role
            },
            TablesNames.TEACHERS,
            { ...body, user_id: createdUserId, address_id: 1 }
        ).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!createTeachers) {
            return;
        } else {
            const createdId = (await service.getLastInsertedItem(TablesNames.TEACHERS))[0].id;
            res.status(200).send({ message: "Professor(a) criado com sucesso.", id: createdId });
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const rawTeachers = (await service.select<TeacherRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.TEACHERS, req.query).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        const rawUsers = (await service.select<UserRaw[]>({
            userId: Number(req.sessionID)
        }, TablesNames.USERS, {}).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        }));

        if (!rawTeachers || !rawUsers) {
            return;
        }

        let user = rawTeachers.map(teacher => {
            const processedTeacher = processTeacher(teacher);
            const teacherUser = rawUsers.find(user => user.id == teacher.user_id)
            return { ...processedTeacher, name: teacherUser.name, email: teacherUser.email }
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

        const updateTeachers = await service.update({
            userId: Number(req.sessionID),
        }, TablesNames.TEACHERS, String(req.query.id), body).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!updateTeachers) {
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

        if (updateTeachers.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para editar este usuário.");
        } else {
            res.status(200).send("Professor(a) atualizado com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});

route.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const deleteTeachers = await service.remove({
            userId: Number(req.sessionID),
        }, TablesNames.TEACHERS, String(req.query.id)).catch(error => {
            res.status(error.status ?? 500).send(error.sqlMessage);
        });

        if (!deleteTeachers) {
            return;
        }

        if (deleteTeachers.affectedRows === 0) {
            res.status(401).send("Você não possui permissão para remover este usuário.");
        } else {
            res.status(200).send("Professor(a) removido com sucesso.");
        }
    } catch (error) {
        return res.status(error.status ?? 500).send(error.message);
    }
});
