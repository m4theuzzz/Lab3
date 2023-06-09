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
    Benefits = "Benefits",
    BOUGHT_Benefits = "BoughtBenefits",
    USERS = "Users",
    STUDENTS = "Students",
    PARTNERS = "Partners",
    TEACHERS = "Teachers",
    TRANSACTIONS = "Transactions"
}
