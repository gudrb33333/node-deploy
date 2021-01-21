import { Hash } from "crypto";
import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from '../models'

export class Hashtag extends Model{

    public title? : string

    static makeTable(sequelize: Sequelize){
        Hashtag.init({
            title: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: true,
              },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'Hashtag',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static assoicate(){
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
}