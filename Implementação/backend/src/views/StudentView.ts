export interface Student {
    id: number;
    userId: number;
    rg: string;
    addressId: number;
    school: string;
    course: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface StudentRaw {
    id: number;
    user_id: number;
    rg: string;
    school: string;
    course: string;
    address_id: number;
    balance: number;
    created_at: Date;
    updated_at: Date;
}

export const processStudent = (userRaw: StudentRaw) => {
    return {
        id: userRaw.id,
        userId: userRaw.user_id,
        rg: userRaw.rg,
        addressId: userRaw.address_id,
        school: userRaw.school,
        course: userRaw.course,
        balance: userRaw.balance,
        createdAt: userRaw.created_at,
        updatedAt: userRaw.updated_at
    };
}

export function StudentProperties() {
    return {
        required: [
            "rg",
            "school",
            "course",
            "address_id",
            "balance",
        ],
        optional: [
            "id",
            "user_id",
        ]
    }
}
