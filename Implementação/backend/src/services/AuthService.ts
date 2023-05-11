import Database from '../modules/Database';
import { processUser } from '../views/UsersView';
import { Security } from '../modules/Security';
import { RequestException } from '../views/RequestExceptionView';
import { AccessView } from '../views/AccessView';
import { findRole } from '../modules/Utils';

class AuthService {
    static authorize = async (email: string, password: string) => {
        const query = `SELECT * FROM Users WHERE email="${email}";`;

        const user = (await Database.executeQuery(query) as any[])[0];

        if (!user) {
            throw { status: 404, message: "Email não cadastrado." } as RequestException;
        }

        const role = await findRole(user.id);

        const userView = processUser(user);
        console.log(Security.AESDecrypt(user.password), password)
        if (Security.AESDecrypt(user.password) == password) {
            return {
                "user": {
                    "id": userView.id,
                    "name": userView.name,
                    "email": userView.email,
                    "role": role
                },
                "sessionToken": Security.JWTEncrypt(userView)
            };
        } else {
            throw { status: 400, message: "Senha incorreta." } as RequestException;
        }
    }

    static authenticate = async (sessionToken: string | string[]): Promise<AccessView> => {
        try {
            const userData = Security.JWTDecrypt(sessionToken as string);

            if (this.tokenIsValid(userData)) {
                await this.authorize(userData.email, Security.AESDecrypt(userData.password));
                return { userId: userData.userId } as AccessView;
            }
        } catch (error) {
            throw error;
        }
    }

    private static tokenIsValid = (userData: any): boolean => {
        if (
            !userData.expireAt ||
            !userData.email ||
            !userData.password ||
            !userData.userId
        ) {
            throw { status: 403, message: "Token inválido." } as RequestException;
        }

        const now = new Date();

        if (now > new Date(userData.expireAt)) {
            throw { status: 403, message: "Token expirado." } as RequestException;
        }

        return true;
    }
}

export default AuthService;
