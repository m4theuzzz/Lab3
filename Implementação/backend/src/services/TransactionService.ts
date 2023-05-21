import { Database } from "../modules/Database";
import { AccessView } from "../views/AccessView";
import { TablesNames } from "../views/QueryBuildView";
import { TransactionRaw } from "../views/TransactionView";

export class TransactionService {
    execute = Database.executeQuery;

    constructor(execute = Database.executeQuery) {
        this.execute = execute
    }

    private async operate(targetId: number, value: number, tableName: TablesNames) {
        const query = `UPDATE ${tableName} SET balance=${value} where id=${targetId};`

        return this.execute(query)
    }

    async transfer(access: AccessView, targetId: number, targetBalance: number, originBalance: number) {
        try {
            await this.operate(targetId, targetBalance, TablesNames.STUDENTS);

            await this.operate(access.userId, originBalance, TablesNames.TEACHERS);
        } catch (error) {
            throw error;
        }
    }

    async buy(access: AccessView, targetId: number, newBalance: number) {
        try {
            await this.operate(access.userId, newBalance, TablesNames.STUDENTS);
        } catch (error) {
            throw error;
        }
    }

}
