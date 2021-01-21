require('dotenv').config();

module.exports = {
  development: {
    username : "root",
    password : process.env.SEQUELIZE_PASSWORD,
    database : "nodebird2",
    host : "192.168.0.49",
    dialect : "mysql"
  },
  test: {
    username : "root",
    password : process.env.SEQUELIZE_PASSWORD,
    database : "nodebird2",
    host : "192.168.0.49",
    dialect : "mysql"
  },
  production: {
    username : "root",
    password : process.env.SEQUELIZE_PASSWORD,
    database : "nodebird2",
    host : "192.168.0.49",
    dialect : "mysql"
  }
};
