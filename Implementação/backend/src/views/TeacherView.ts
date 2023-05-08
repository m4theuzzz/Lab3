export interface Teacher {
    id: number;
    userId: number;
    department: string;
    cpf: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeacherRaw {
    id: number;
    user_id: number;
    cpf: number;
    department: string;
    created_at: Date;
    updated_at: Date;
}

export const processTeacher = (userRaw: TeacherRaw) => {
    return {
        id: userRaw.id,
        userId: userRaw.user_id,
        department: userRaw.department,
        cpf: userRaw.cpf,
        createdAt: userRaw.created_at,
        updatedAt: userRaw.updated_at
    };
}

export const TeacherProperties = () => ({
    required: [
        "cpf",
        "department"
    ],
    optional: [
        "id",
        "user_id"
    ]
})
