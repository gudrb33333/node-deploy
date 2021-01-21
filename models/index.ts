import { Sequelize} from 'sequelize';
import { User } from './user';
import { Post } from './post'
import { Hashtag } from './hashtag'
import { FileManage } from './fileManage'
import { FileManageDetail } from './fileManageDetail'

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize:Sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

export const db = {
    sequelize,
    User,
    Post,
    Hashtag,
    FileManage,
    FileManageDetail
};

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.FileManage = FileManage;
db.FileManageDetail = FileManageDetail;

User.makeTable(sequelize);
Post.makeTable(sequelize);
Hashtag.makeTable(sequelize);
FileManage.makeTable(sequelize);
FileManageDetail.makeTable(sequelize);

User.associate();
Post.associate();
Hashtag.assoicate();
FileManage.associate();
FileManageDetail.associate();

