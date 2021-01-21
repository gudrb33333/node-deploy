import * as passport from 'passport';
import { local } from './localStrategy';
import { kakao } from './kakaoStrategy'; 
import { User } from '../models/user';

import { ExpressUser } from '../interface'

export const passportConfig = () => {
    passport.serializeUser((user:ExpressUser , done: any) => {
      done(null, user.id);
    });
  
    passport.deserializeUser((id: number, done: any) => {
      User.findOne({
        where: { id },
        include: [{
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followers',
        }, {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followings',
        }],
      })
        .then(user => done(null, user))
        .catch(err => done(err));
    });
  
    local();
    kakao();
  };
  