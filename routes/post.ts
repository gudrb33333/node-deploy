import {Request, Response, NextFunction, Router} from 'express'
import * as multer from 'multer';
import * as sharp from 'sharp'
import * as path from 'path';
import * as fs from 'fs';

import { db } from '../models';
import { FileManage } from '../models/fileManage'
import { FileManageDetail } from '../models/fileManageDetail'
import { User } from '../models/user'

import { MulterFile } from '../interface'

import { QueryTypes, Sequelize } from 'sequelize';
import { isLoggedIn } from './middlewares';

export const postRouter:Router = Router();

try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination(req:Request, file:Express.Multer.File, cb: Function) {
        cb(null, 'uploads/');
      },
      filename(req:Request, file:Express.Multer.File, cb: Function) {
        const ext:string = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
  });

postRouter.post('/img', isLoggedIn, upload.array('img'), async (req:Request &  {  files:MulterFile[ ] }, res:Response ,next:NextFunction) => {

    try{     
      let attachId:string;

      //만약 req.body에 attachId값이 없다면 DB에서 찾아옴
      if(!req.body.attachId[0]){
         let result1:FileManage = await <FileManage><any>FileManage.create({
         useAt: 'Y',
         UserId: req.user.id,
        });
         attachId = result1.id;
      }else{
         attachId = req.body.attachId;
      }

      //db에서 찾은 attachId의 최대값에서 +1
      let result2:FileManageDetail[] = await <FileManageDetail[]><any>db.sequelize.query(
        "SELECT IFNULL(MAX(fileSn),0)+1 as fileSn  FROM `FileManageDetail` WHERE atchFileid = :atchFileid"
        ,{ 
        replacements: { atchFileid: attachId },
        type: QueryTypes.SELECT ,
      });  

      //FileManageDetail 테이블에 fileSn로 순차적으로 인설트
      let atchFileArray = new Array();


      for(let i:number=0; i<req.files.length; i++){
        let fileLength:number = req.files[i].filename.length;
        let lastDot:number = req.files[i].filename.lastIndexOf('.');
        let FileExtsion:string = req.files[i].filename.substring(lastDot+1, fileLength);

        await FileManageDetail.create({   
          atchFileId:	attachId,
          FileSn: result2[0].fileSn+i,	
          FileStreCours: req.files[i].destination,
          StreFileNm	: req.files[i].filename,
          OrignlFileNm: req.files[i].originalname,	
          FileExtsn	: FileExtsion,
          FileSize	: req.files[i].size
        });

       atchFileArray.push({ 
          atchFileId: attachId,
          url:`/img/${req.files[i].filename}`,
          fileSn: result2[0].fileSn+i
        });

      }

      res.json({ atchFileArray: atchFileArray} );
    
      }catch(error){
        console.error(error);
        next(error);
      }
    });

const upload2 = multer();
postRouter.post('/', isLoggedIn, upload2.none(), async (req:Request, res:Response ,next:NextFunction) => {
  try {

    const post = await db.Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag: string) => {
          return db.Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      //await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});