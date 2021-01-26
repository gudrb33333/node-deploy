import {Request, Response, NextFunction, Router} from 'express'
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as AWS from 'aws-sdk'
import * as multerS3 from 'multer-s3'

import { db } from '../models';
import { FileManage } from '../models/fileManage'
import { FileManageDetail } from '../models/fileManageDetail'
import { User } from '../models/user'

import { MulterFile } from '../interface'
import { ExpressUser } from '../interface'

import { QueryTypes, Sequelize } from 'sequelize';
import { isLoggedIn } from './middlewares';

export const postRouter:Router = Router();

  try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }

  AWS.config.update({
      accessKeyId:process.env.S3_ACCESS_KEY_ID,
      secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
      region:'ap-northeast-2'
  });

  const upload = multer({
    storage: multerS3({
      s3:new AWS.S3(),
      bucket: 'gudrb33333',
      key(req:Request, file:Express.Multer.File, cb:Function){
        cb(null,`original/${Date.now()}${path.basename(file.originalname)}`);
      }
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
  });

postRouter.post('/', isLoggedIn, upload.array('img'), async (req:Request &  {  files:MulterFile[ ] } & {  user: ExpressUser }, res:Response ,next:NextFunction) => {
    console.log(req.files);
    try{     

      //만약 req.body에 attachId값이 없다면 DB에서 찾아옴
      /*
      if(!req.body.attachId[0]){
         let result1:FileManage = await <FileManage><any>FileManage.create({
         useAt: 'Y',
         UserId: req.user.id,
        });
         attachId = result1.id;
      }else{
         attachId = req.body.attachId;
      }
    */

      let result1:FileManage = await <FileManage><any>FileManage.create({
        useAt: 'Y',
        UserId: req.user.id,
       });
       let attachId:string = result1.id;

      //db에서 찾은 attachId의 최대값에서 +1
      /*
      let result2:FileManageDetail[] = await <FileManageDetail[]><any>db.sequelize.query(
        "SELECT IFNULL(MAX(fileSn),0)+1 as fileSn  FROM `FileManageDetail` WHERE atchFileid = :atchFileid"
        ,{ 
        replacements: { atchFileid: attachId },
        type: QueryTypes.SELECT ,
      });  
      */

      //FileManageDetail 테이블에 fileSn로 순차적으로 인설트
      let atchFileArray = new Array();
      let repImg:string;

      for(let i:number=0; i<req.files.length; i++){
        let fileLength:number = req.files[i].originalname.length;
        let lastDot:number = req.files[i].originalname.lastIndexOf('.');
        let FileExtsion:string = req.files[i].originalname.substring(lastDot+1, fileLength);
        let streFileNm:string = req.files[i].key.split('/')[req.files[i].key.split('/').length - 1 ];
        repImg = req.files[0].location.replace(/\/original\//,'/thumb/');

        await FileManageDetail.create({   
          atchFileId:	attachId,
          FileSn: i,	
          FileStreCours: req.files[i].location,
          StreFileNm	: streFileNm,
          OrignlFileNm: req.files[i].originalname,	
          FileExtsn	: FileExtsion,
          FileSize	: req.files[i].size
        });
        /*
       atchFileArray.push({ 
          atchFileId: attachId,
          url: req.files[i].location.replace(/\/original\//,'/thumb/'),
          fileSn: i
        });
      */
      }

    const post = await db.Post.create({
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      content: req.body.content,
      img: attachId,
      repImg: repImg,
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

      //res.json({ atchFileArray: atchFileArray} );
    
      }catch(error){
        console.error(error);
        next(error);
      }
    });

const upload2 = multer();
postRouter.post('/none', isLoggedIn, upload2.none(), async (req:Request & {  user: ExpressUser }, res:Response ,next:NextFunction) => {
  try {

    const post = await db.Post.create({
      content: req.body.content,
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
