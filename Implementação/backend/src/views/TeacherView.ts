import { User, UserRaw, processUser } from "./UsersView";

export interface Teacher extends User {
    department: string;
    account: string;
}

export const processTeacher = (userRaw: UserRaw) => {
    return {
        ...processUser(userRaw),
        department: userRaw.department,
        account: userRaw.account,
    };
}
