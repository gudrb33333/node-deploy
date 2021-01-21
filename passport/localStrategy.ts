import * as passport  from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import * as bcrypt from 'bcrypt';

import { User } from '../models/user';



export const local = () => {
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    }, async (email:string, password:string, done: any) => {
      try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
          const result = await bcrypt.compare(password, exUser.password);
          if (result) {
            done(null, exUser);
          } else {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          }
        } else {
          done(null, false, { message: '가입되지 않은 회원입니다.' });
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }));
  };
  