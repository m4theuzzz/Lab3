import 'dotenv/config';

import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';

import { Database } from './src/modules/Database';
import { randomUUID } from 'crypto';

const app = express();

const sess = {
    secret: 'keybord cat',
    genid: () => randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60,
    }
}

if (process.env.ENV === 'production') {
    const allowedOrigins = ['http://localhost']; //change to deployed origin
    app.use(cors({
        origin: function (origin: any, callback: any) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));

    app.set('trust proxy', 1);
    sess.cookie.secure = true;
} else {
    app.use(cors());
}

app.use(session(sess));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));

import { route as AuthController } from './src/controllers/AuthController';
import { route as UserController } from './src/controllers/UserController';
import { route as PartnerController } from './src/controllers/PartnerController';
import { route as StudentController } from './src/controllers/StudentController';
import { route as TeacherController } from './src/controllers/TeacherController';
import { route as TransactionController } from './src/controllers/TransactionController';
import { route as BenefictController } from './src/controllers/BenefictController';
import { route as BoughtBenefictController } from './src/controllers/BoughtBenefictController';

app.use('/auth', AuthController);
app.use('/users', UserController);
app.use('/partners', PartnerController);
app.use('/students', StudentController);
app.use('/teachers', TeacherController);
app.use('/transactions', TransactionController);
app.use('/beneficts', BenefictController);
app.use('/beneficts', BoughtBenefictController);

app.listen(process.env.API_PORT, async () => {
    Database.connectMysql();
    console.log(`A API está online na porta: ${process.env.API_PORT}`);
});
