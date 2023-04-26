export interface Student {
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
        rg: userRaw.rg,
        addressId: userRaw.address_id,
        school: userRaw.school,
        course: userRaw.course,
        balance: userRaw.balance,
        createdAt: userRaw.created_at,
        updatedAt: userRaw.updated_at
    };
}
