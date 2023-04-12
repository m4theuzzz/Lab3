import 'dotenv/config';
import { createConnection, Connection } from 'mysql';
import { QueryBuildView, QueryTypes } from '../views/QueryBuildView';
import { RequestException } from '../views/RequestExceptionView';
import { escape } from './Utils';

let connection: Connection;

class Database {
    static connectMysql(newCon: Connection = null) {
        if (!!newCon) {
            return connection = newCon;
        } else {
            return connection = createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT)
            });
        }
    }

    static executeQuery<T>(query: string, params: Object = {}): Promise<T> {
        if (!connection) throw new Error("Conexão com banco não foi estabelecida.");

        return new Promise<T>((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static buildQuery(params: QueryBuildView) {
        try {
            let query = this.buildQueryStart(params.type);
            query += `${params.tableName} `;
            query += this.buildQueryBody(params.type, params.columns, params.values);
            query += this.buildQueryFilters(params.type, params.filters);
            query += this.buildOrderByString(params.type, params.orderBy);
            query += `;`;
            return query;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private static buildQueryStart(type: QueryTypes): string {
        switch (type) {
            default:
            case QueryTypes.SELECT:
                return `SELECT * FROM `;
            case QueryTypes.INSERT:
                return `INSERT INTO `;
            case QueryTypes.UPDATE:
                return `UPDATE `;
            case QueryTypes.DELETE:
                return `DELETE FROM `;
        }
    }

    private static buildQueryBody(type: QueryTypes, columns: string[] | undefined, values: string[] | undefined): string {
        try {
            let query = ``;
            switch (type) {
                case QueryTypes.INSERT:
                    this.validateColumnsAndValues(columns, values);

                    query += `(`;
                    query += columns.join(', ');
                    query += `) VALUES (`;
                    query += values.map(value => `"${escape(value)}"`).join(', ');
                    query += `)`;
                    return query;

                case QueryTypes.UPDATE:
                    this.validateColumnsAndValues(columns, values);

                    query += `SET `;
                    for (let i = 0; i < columns.length; i++) {
                        query += `${columns[i]}="${escape(values[i])}"`;

                        if (i < columns.length - 1) {
                            query += `, `;
                        } else {
                            query += ` `;
                        }
                    }
                    return query;

                default:
                case QueryTypes.SELECT:
                case QueryTypes.DELETE:
                    return query;

            }
        } catch (error) {
            throw error;
        }
    }

    private static validateColumnsAndValues(columns: string[] | undefined, values: string[] | undefined) {
        if (
            !columns ||
            !values ||
            columns.length !== values.length
        ) {
            throw { status: 400, message: 'Para cada coluna um valor deve ser passado' } as RequestException;
        }

        return true;
    }

    private static buildQueryFilters(type: QueryTypes, filters: { [key: string]: string }) {
        try {
            let query = ``;
            switch (type) {
                case QueryTypes.SELECT:
                    query += this.buildFilterString(filters);
                    return query;

                case QueryTypes.UPDATE:
                    query += this.buildFilterString(filters);
                    return query;

                case QueryTypes.DELETE:
                    query += this.buildFilterString(filters);
                    return query;

                default:
                case QueryTypes.INSERT:
                    return query;
            }
        } catch (error) {
            throw error;
        }
    }

    private static buildFilterString(filters: { [key: string]: string }) {
        const keys = Object.keys(filters);
        let query = `WHERE `;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            query += `${key}="${filters[key]}"`;
            if (i < keys.length - 1) {
                query += ` AND `;
            } else {
                query += ``;
            }
        }
        return query;
    }

    private static buildOrderByString(type: QueryTypes, orderBy: string[] | undefined) {
        try {
            let query = ``;
            switch (type) {
                case QueryTypes.SELECT:
                    if (orderBy) {
                        query += ` ORDER BY ${orderBy.join(', ')}`;
                    }
                    return query;

                default:
                case QueryTypes.INSERT:
                case QueryTypes.UPDATE:
                case QueryTypes.DELETE:
                    return query;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default Database;
