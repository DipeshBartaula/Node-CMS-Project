// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "sepcms",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

//For deployment
module.exports = {
  HOST: "containers-us-west-134.railway.app",
  USER: "root",
  PASSWORD: "dRMTxCubwlmvldD6dH7K",
  DB: "railway",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
