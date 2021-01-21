import {Request, Response, NextFunction, Application} from 'express';
import * as express from "express";
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as path from 'path';
import * as session from 'express-session';
import * as nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
import * as passport from 'passport';

dotenv.config();
import { db } from './models';
import { pageRouter } from './routes/page';
import { authRouter } from './routes/auth';
import { postRouter } from './routes/post';

import { passportConfig } from './passport';
import { logger } from './logger';

const app: Application = express();
const port: number = Number(process.env.PORT);

passportConfig();
app.set('port',port | 8001);
app.set('view engine', 'html');
nunjucks.configure('views',{ express: app, watch: true});

db.sequelize.sync({force: false})
    .then(()=>{
        console.log('데이터베이스 연결 성공')
    })
    .catch((err)=>{
        console.error(err)
    })

if(process.env.NODE_ENV === 'production'){    
    app.use(morgan('combined'));
}else{
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    proxy : false
};

if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req:Request, res:Response, next:NextFunction)=>{
    const error:Error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    //error.status = 404;
    logger.info('hello');
    logger.error(error.message);
     next(error);
});

app.use((err:Error, req:Request, res:Response, next:NextFunction)=>{
    
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV !== 'production' ? err :{}
    //res.status(err.status || 500)
    res.render('error')
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});