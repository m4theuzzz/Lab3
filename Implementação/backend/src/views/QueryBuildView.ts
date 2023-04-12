export interface QueryBuildView {
    type: QueryTypes;
    tableName: TablesNames;
    filters: { [key: string]: string };
    columns?: string[];
    values?: string[];
    orderBy?: string[];
}

export enum QueryTypes {
    SELECT = "SELECT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export enum TablesNames {
    ADDRESSES = "Addresses",
    APPOINTMENTS = "Appointments",
    PATIENTS = "Patients",
    USERS = "Users",
}
