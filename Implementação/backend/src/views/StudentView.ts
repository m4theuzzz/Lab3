import { User, UserRaw, processUser } from "./UsersView";

export interface Student extends User {
    cpf: string;
    rg: string;
    addressId: string;
    school: string;
    course: string;
    balance: number;
}

export const processStudent = (userRaw: UserRaw) => {
    return {
        ...processUser(userRaw),
        cpf: userRaw.cpf,
        rg: userRaw.rg,
        addressId: userRaw.address_id,
        school: userRaw.school,
        course: userRaw.course,
        balance: userRaw.balance,
    };
}
