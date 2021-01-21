import {Request, Response, NextFunction, Router} from 'express'
import { isLoggedIn, isNotLoggedIn }from './middlewares';

import { db } from '../models'

export const pageRouter:Router = Router();

pageRouter.use((req:Request, res:Response ,next:NextFunction)=>{
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

pageRouter.get('/profile', isLoggedIn, (req:Request, res:Response)=>{
    res.render('profile',{ title: '내 정보 - NodeBird'})
});

pageRouter.get('/addpost', isLoggedIn, (req:Request, res:Response) => {
  res.render('addpost', { title: '중고거래 글쓰기 - NodeBird' });
});

pageRouter.get('/join',isNotLoggedIn,(req:Request, res:Response)=>{
    res.render('join',{ title: '회원가입 - NodeBird'})
});

pageRouter.get('/', async (req:Request, res:Response, next:NextFunction) => {
    try {
  
      if(!req.isAuthenticated()){
        res.render('login', {
          title: 'NodeBird'
        });
      }else{
        const posts = await db.Post.findAll({
          include: {
            model: db.User,
            attributes: ['id', 'nick'],
          },
          order: [['updatedAt', 'DESC']],
          offset: 0,
          limit: 10,
        });
  
        res.render('main', {
          title: 'NodeBird',
          cards: posts,
        });
      }
  
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
