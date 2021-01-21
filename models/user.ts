import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from '../models'

export class User extends Model{

  public id? : number
  public email? : string
  public nick? : string
  public password? : string
  public provider? : string
  public snsId? : string
  
  static makeTable(sequelize: Sequelize){
    User.init({
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      }
      },{
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'User',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      })
  }

  static associate() {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.FileManage);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
}


/*
import { Sequelize, Model, DataTypes } from "sequelize";


export class User extends Model {

    public id! : string
    public email! : string
    public nick! : string
    public password! : string
    public provider! : string
    public snsId! : string      
}

User.init(
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: 'local'
      },
      snsId: {
          type: DataTypes.STRING(30),
          allowNull: true
      }
    },
    {
      sequelize, // passing the `sequelize` instance is required
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: "users",
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );
  */