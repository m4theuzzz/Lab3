export interface UsersView {
    id: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UsersRaw {
    id: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    level: number;
    created_at: Date;
    updated_at: Date;
}

export function processUser(raw: UsersRaw): UsersView {
    return {
        id: raw.id,
        name: raw.name,
        password: raw.password,
        email: raw.email,
        level: raw.level,
        phone: raw.phone,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as UsersView;
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
            "phone"
        ]
    }
}
