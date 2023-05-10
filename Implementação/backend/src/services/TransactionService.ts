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

    private async operate(access: AccessView, targetId: number, transaction: TransactionRaw, tableName: TablesNames) {
        const target = (await service.select<StudentRaw[]>(
            access,
            tableName,
            { id: targetId }
        ).catch(error => {
            throw new Error("Usuário não encontrado.");
        }))[0];

        if (!target) {
            return;
        }

        let value = 0;

        if (transaction.type == "credit") {
            value = Number(target.balance) + Number(transaction.value);
        } else {
            value = Number(target.balance) - Number(transaction.value);
        }

        console.log()

        if (transaction.value < 0) {
            throw new Error("Operação inválida. Não há creditos suficientes.");
        }

        const query = `UPDATE ${tableName} SET balance=${value} where id=${targetId};`

        return this.execute(query)
    }

    async transfer(access: AccessView, transaction: TransactionRaw) {
        try {
            await this.operate(access, transaction.target, transaction, TablesNames.STUDENTS);

            if (transaction.type === "credit") {
                await this.operate(access, access.userId, { ...transaction, type: "debit" }, TablesNames.TEACHERS);
            } else {
                await this.operate(access, access.userId, { ...transaction, type: "credit" }, TablesNames.TEACHERS);
            }
        } catch (error) {
            throw error;
        }
    }

}
