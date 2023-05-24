import 'dotenv/config';
import * as crypto from 'crypto';
import { User } from '../views/UsersView';
import { sign, verify } from 'jsonwebtoken';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

export class Security {
    static getKey(salt: Buffer) {
        return crypto.pbkdf2Sync(process.env.KEY, salt, 100000, 32, 'sha512');
    }

    static AESEncrypt(plainText: string) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);

        const key = this.getKey(salt);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(String(plainText), 'utf8'),
            cipher.final(),
        ]);

        const tag = cipher.getAuthTag();

        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    }

    static AESDecrypt(cipherText: string) {
        const stringValue = Buffer.from(String(cipherText), 'base64');

        const salt = stringValue.slice(0, SALT_LENGTH);
        const iv = stringValue.slice(SALT_LENGTH, TAG_POSITION);
        const tag = stringValue.slice(TAG_POSITION, ENCRYPTED_POSITION);
        const encrypted = stringValue.slice(ENCRYPTED_POSITION);

        const key = this.getKey(salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        decipher.setAuthTag(tag);

        return decipher.update(encrypted) + decipher.final('utf8');
    }

    static JWTEncrypt(userData: any) {
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 2);

        return sign(
            {
                userId: userData.id,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                expireAt: expireDate
            },
            process.env.KEY
        );
    }

    static JWTDecrypt(sessionToken: string) {
        const userData = verify(sessionToken, process.env.KEY) as any;
        return userData;
    }
}
