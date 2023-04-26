export interface User {
    id: number;
    name: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRaw {
    id: number;
    name: string;
    password: string;
    email: string;
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
        ]
    }
}
