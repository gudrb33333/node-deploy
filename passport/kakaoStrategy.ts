import * as passport  from 'passport';
import {Strategy as KakaoStrategy} from 'passport-kakao';

import { User } from '../models/user';

export const kakao = () => {
    passport.use(new KakaoStrategy({
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.COOKIE_SECRET,
      callbackURL: '/auth/kakao/callback',
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      console.log('kakao profile', profile);
      try {
        const exUser = await User.findOne({
          where: { snsId: profile.id, provider: 'kakao' },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            email: profile._json && profile._json.kakao_account_email,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'kakao',
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }));
  };
  