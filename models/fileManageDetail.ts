import {Sequelize, Model, DataTypes } from "sequelize";
import { db } from '.'

export class FileManageDetail extends Model{

    public atchFileId? : string;
    public fileSn? : number;
    public fileStreCours? : string;
    public streFileNm? : string;
    public orignlFileNm? : string;
    public fileExtsn? : string;
    public fileCn? : string;
    public fileSize? : string;


    static makeTable(sequelize: Sequelize){
        FileManageDetail.init({
            atchFileId: {
                type: DataTypes.STRING(10),
                primaryKey: true,
              },
              FileSn: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
              },
              FileStreCours: {
                type: DataTypes.STRING,
                allowNull: false,
              },
              StreFileNm: {
                type: DataTypes.STRING,
                allowNull: false,
              },
              OrignlFileNm: {
                type: DataTypes.STRING
              },
              FileExtsn: {
                type: DataTypes.STRING,
                allowNull: false
              },
              FileCn: {
                type: DataTypes.STRING
              },
              FileSize: {
                type: DataTypes.STRING
              },         
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'FileManageDetail',
            tableName: 'FileManageDetail',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    };

    static associate(){
       
    };
}