import { UsersProperties } from "../views/UsersView";
import { RequestException } from '../views/RequestExceptionView';
import { AddressProperties } from "../views/AddressView";
import { StudentProperties, StudentRaw } from "../views/StudentView";
import { PartnerProperties, PartnerRaw } from "../views/PartnerView";
import { TeacherProperties, TeacherRaw } from "../views/TeacherView";
import { TransactionProperties, TransactionRaw } from "../views/TransactionView";
import Database from "./Database";
import GenericService from "../services/GenericService";
import { AccessView } from "../views/AccessView";
import { TablesNames } from "../views/QueryBuildView";

const service = new GenericService();

const viewProperties: any = {
    Users: UsersProperties(),
    Students: StudentProperties(),
    Partners: PartnerProperties(),
    Addresses: AddressProperties(),
    Teachers: TeacherProperties(),
    Transactions: TransactionProperties()
}

export function filterObject(viewName: string, receivedProperties: any) {
    const view = viewProperties[viewName];
    let params = receivedProperties;

    if (!view) {
        throw { status: 404, message: "Rota não existe" } as RequestException;
    }

    const possibleParams = [...view.required, ...view.optional];
    for (const key in receivedProperties) {
        if (!possibleParams.includes(key)) {
            delete params[key];
        }
    }

    return params;
}

export function verifyIntegrity(viewName: string, receivedProperties: any): boolean {
    const view = viewProperties[viewName];

    if (!view) {
        return false;
    }

    let requiredCounter = 0;
    let optionalCounter = 0;
    for (const key in receivedProperties) {
        if (view.required.indexOf(key) > -1) {
            requiredCounter++;
            continue;
        }

        if (view.optional.indexOf(key) > -1) {
            optionalCounter++;
        }
    }

    if (
        requiredCounter !== view.required.length ||
        (requiredCounter + optionalCounter) !== Object.keys(receivedProperties).length
    ) {
        return false;
    }

    return true;
}

export function escape(string: any): string {
    if (typeof string !== "string") {
        return string;
    }
    string = string.replace('"', '\\"');
    string = string.replace("\'", "\\'");
    string = string.replace('`', '\\`');
    return string;
}

export async function findRole(userId: number): Promise<string> {
    const teacherQuery = `SELECT * FROM Teachers WHERE user_id=${userId};`;
    const studentQuery = `SELECT * FROM Students WHERE user_id=${userId};`;
    const partnerQuery = `SELECT * FROM Partners WHERE user_id=${userId};`;

    const teacher = (await Database.executeQuery<TeacherRaw[]>(teacherQuery))[0];

    if (!!teacher) {
        return "teacher";
    }

    const student = (await Database.executeQuery<StudentRaw[]>(studentQuery))[0];

    if (!!student) {
        return "student";
    }

    const partner = (await Database.executeQuery<PartnerRaw[]>(partnerQuery))[0];

    if (!!partner) {
        return "partner";
    }

    throw new Error("Usuário não encontrado.");
}

export async function getTargetNewBalance(access: AccessView, targetId: number, transaction: TransactionRaw, tableName: TablesNames) {
    const target = (await service.select<StudentRaw[]>(
        access,
        tableName,
        { id: targetId }
    ).catch(error => {
        throw new Error("Usuário não encontrado.");
    }))[0];
    if (!target) {
        throw new Error("Destinatário inválido.");
    }

    let value = 0;
    if (transaction.type == "credit") {
        value = Number(target.balance) + Number(transaction.value);
    } else {
        value = Number(target.balance) - Number(transaction.value);
    }

    if (value < 0) {
        throw new Error("Operação inválida. Não há creditos suficientes.");
    }

    return value;
}
