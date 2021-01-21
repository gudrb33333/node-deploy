import {Sequelize, Model, DataTypes } from "sequelize";
import { db } from '../models'

export class FileManage extends Model{
    public id?: string;
    public useAt? : string

    
    static makeTable(sequelize: Sequelize){
        FileManage.init({
            useAt: {
                type: DataTypes.STRING(1),
                allowNull: false,
              }
            
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'FileManage',
            tableName: 'FileManage',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    };

    static associate(){
     db.FileManage.belongsTo(db.User);
    };
}