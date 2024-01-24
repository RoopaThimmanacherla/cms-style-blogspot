const userseeds = require('./userseeds');
const postseeds =require('./postseeds');
const postcomments=require('./commentseeds');
const sequelize=require('../config/connection');


const seedAll=async()=>{
    await sequelize.sync({ force: true });

    await seedUsers();
    await seedPosts();
    await seedComments();
    process.exit(0);
};

seedAll();