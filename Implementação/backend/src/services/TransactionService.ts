import Database from "../modules/Database";
import { AccessView } from "../views/AccessView";
import { TablesNames } from "../views/QueryBuildView";
import { StudentRaw } from "../views/StudentView";
import { TransactionRaw } from "../views/TransactionView";
import GenericService from "./GenericService";

const service = new GenericService();

export class TransactionService {
    execute = Database.executeQuery;

    constructor(execute = Database.executeQuery) {
        this.execute = execute
    }

    private async operate(access: AccessView, targetId: number, transaction: TransactionRaw) {
        const target = (await service.select<StudentRaw[]>(
            access,
            TablesNames.STUDENTS,
            { id: targetId }
        ).catch(error => {
            throw new Error("Usuário não encontrado.");
        }))[0];

        if (!target) {
            return;
        }

        let value = 0;

        if (transaction.type == "credit") {
            value = target.balance + transaction.value;
        } else {
            value = target.balance - transaction.value;
        }

        if (transaction.value < 0) {
            throw new Error("Operação inválida. Não há creditos suficientes.");
        }

        const query = `UPDATE Students SET balance=${value} where id=${targetId};`

        return this.execute(query)
    }

    async transfer(access: AccessView, transaction: TransactionRaw) {
        try {
            await this.operate(access, transaction.target, transaction);

            if (transaction.type === "credit") {
                await this.operate(access, access.userId, { ...transaction, type: "debit" });
            } else {
                await this.operate(access, access.userId, { ...transaction, type: "credit" });
            }
        } catch (error) {
            throw error;
        }
    }

    async undoOperation(access: AccessView, transaction: TransactionRaw) { }

}
