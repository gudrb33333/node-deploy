import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from '../models'

export class Post extends Model{

    public content? : string;
    public img? : string;
    
    static makeTable(sequelize: Sequelize){
        Post.init({
            content:{
                type: DataTypes.STRING(140),
                allowNull: false
            },
            img: {
                type: DataTypes.STRING(200),
                allowNull: true
            },

        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'Post',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

        static associate(){
            db.Post.belongsTo(db.User);
            db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        }
}