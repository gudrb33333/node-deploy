import {Request, Response, NextFunction, Router} from 'express'
import * as passport from 'passport'
import * as bcrypt from 'bcrypt'

import { isLoggedIn, isNotLoggedIn } from './middlewares';
import { db } from '../models'

export const authRouter:Router = Router();


authRouter.post('/join', isNotLoggedIn, async (req:Request, res:Response, next:NextFunction) => {
    const { email, nick, password } = req.body;
    try {
      const exUser = await db.User.findOne({ where: { email } });
      if (exUser) {
        return res.redirect('/join?error=exist');
      }
      const hash = await bcrypt.hash(password, 12);
      await db.User.create({
        email,
        nick,
        password: hash,
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  authRouter.post('/login', isNotLoggedIn, (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });
  
  authRouter.get('/logout', isLoggedIn, (req:Request, res:Response) => {
    req.logout();
    req.session.destroy((err)=>{
        console.log(err);
    });
    res.redirect('/');
  });
  
  authRouter.get('/kakao', passport.authenticate('kakao'));
  
  authRouter.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/');
  });
  
