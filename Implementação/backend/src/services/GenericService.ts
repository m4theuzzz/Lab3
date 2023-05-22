import { filterObject, verifyIntegrity } from "../modules/Utils";
import { AccessView } from "../views/AccessView";
import { TablesNames, QueryBuildView, QueryTypes } from "../views/QueryBuildView";
import { Database } from "../modules/Database";

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
        queryOptions.filters = filters

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

        queryOptions.columns = columns;
        queryOptions.values = values;

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

        queryOptions.filters = { "id": targetId };

        const query = Database.buildQuery(queryOptions);
        console.log(query);

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

        queryOptions.filters = { "id": targetId };

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

    getLastInsertedItem = (service: TablesNames): Promise<[{ id: number }]> => {
        const query = `SELECT id FROM ${service} order by created_at DESC LIMIT 1;`
        return this.execute(query);
    }
}

export default GenericService;
