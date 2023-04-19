export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRaw {
    id: string;
    name: string;
    password: string;
    email: string;
    cpf: string;
    rg: string;
    address_id: string;
    school: string;
    course: string;
    balance: number;
    department: string;
    account: string;
    beneficts: string[];
    created_at: Date;
    updated_at: Date;
}

export function processUser(raw: UserRaw): User {
    return {
        id: raw.id,
        name: raw.name,
        password: raw.password,
        email: raw.email,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as User;
}

export function UsersProperties() {
    return {
        required: [
            "name",
            "email",
            "password",
        ],
        optional: [
            "id",
            "phone",
            "cpf",
            "rg",
            "address_id",
            "school",
            "course",
            "balance",
            "department",
            "account",
            "beneficts",
        ]
    }
}
