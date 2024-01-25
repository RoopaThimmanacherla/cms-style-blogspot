const seedUsers = require('./userseeds');
const seedPosts =require('./postseeds');
const seedComments=require('./commentseeds');
const sequelize=require('../config/connection');


const seedAll=async()=>{
    await sequelize.sync({ force: true });

    await seedUsers();
    await seedPosts();
    await seedComments();
    process.exit(0);
};

seedAll();