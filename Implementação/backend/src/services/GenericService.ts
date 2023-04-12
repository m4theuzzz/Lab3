import Database from "../modules/Database"
import { filterObject, verifyIntegrity } from "../modules/Utils";
import { AccessView } from "../views/AccessView";
import { Created } from "../views/CreatedView";
import { TablesNames, QueryBuildView, QueryTypes } from "../views/QueryBuildView"
import { RequestException } from "../views/RequestExceptionView";

class GenericService {
    execute = Database.executeQuery;

    constructor(execute = Database.executeQuery) {
        this.execute = execute
    }

    select<T>(
        access: AccessView,
        service: TablesNames,
        queryParams: {},
        orderBy: string[] = null
    ): Promise<T> {
        let queryOptions = {
            type: QueryTypes.SELECT,
            tableName: service,
        } as QueryBuildView;

        const filters = filterObject(service, queryParams);

        if (service !== TablesNames.USERS) {
            queryOptions.filters = { ...filters, "created_by": access.userId };
        } else {
            queryOptions.filters = { ...filters, "id": access.userId };
        }

        if (orderBy) {
            queryOptions.orderBy = orderBy;
        }

        const query = Database.buildQuery(queryOptions);

        return this.execute<T>(query);
    }

    create(
        access: AccessView,
        service: TablesNames,
        requestBody: any
    ) {
        const properties = filterObject(service, requestBody);

        verifyIntegrity(service, requestBody);

        let queryOptions = {
            type: QueryTypes.INSERT,
            tableName: service,
        } as QueryBuildView;

        const { columns, values } = this.buildColumnsAndValuesArray(properties);

        if (service !== TablesNames.USERS) {
            queryOptions.columns = [...columns, "created_by"];
            queryOptions.values = [...values, access.userId];
        } else {
            if (access.level < 7) {
                throw { status: 401, message: "Você não possui permissão para realizar essa operação." } as RequestException;
            }
            queryOptions.columns = columns;
            queryOptions.values = values;
        }

        const query = Database.buildQuery(queryOptions);

        return this.execute<any>(query);
    }

    update(
        access: AccessView,
        service: TablesNames,
        targetId: string,
        requestBody: any
    ) {
        const properties = filterObject(service, requestBody);

        verifyIntegrity(service, requestBody);

        let queryOptions = {
            type: QueryTypes.UPDATE,
            tableName: service,
        } as QueryBuildView;

        const { columns, values } = this.buildColumnsAndValuesArray(properties);

        queryOptions.columns = columns;
        queryOptions.values = values;

        if (service !== TablesNames.USERS) {
            queryOptions.filters = { "id": targetId, "created_by": access.userId };
        } else {
            queryOptions.filters = { "id": access.userId };
        }

        const query = Database.buildQuery(queryOptions);

        return this.execute<any>(query);
    }

    remove(
        access: AccessView,
        service: TablesNames,
        targetId: string
    ) {
        let queryOptions = {
            type: QueryTypes.DELETE,
            tableName: service,
        } as QueryBuildView;

        if (service !== TablesNames.USERS) {
            queryOptions.filters = { "id": targetId, "created_by": access.userId };
        } else {
            queryOptions.filters = { "id": targetId };
        }

        const query = Database.buildQuery(queryOptions);

        return this.execute<any>(query);
    }

    private buildColumnsAndValuesArray = (properties: any) => {
        return Object.keys(properties).reduce(
            (acc: { columns: string[], values: string[] }, key: string) => {
                acc.columns.push(key);
                acc.values.push(properties[key]);
                return acc;
            }, { columns: [], values: [] }
        );
    }

    getLastInsertedItem = (service: TablesNames, userId: string): Promise<[{ id: string }]> => {
        const query = `SELECT id FROM ${service} where created_by='${userId}' order by created_at DESC LIMIT 1;`
        return this.execute(query);
    }
}

export default GenericService;
