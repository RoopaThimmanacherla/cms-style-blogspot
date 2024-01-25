const express=require('express');
const path=require('path');
const sequelize=require('./config/connection');
const helpers=require('./utils/helper');
const exphbs=require('express-handlebars');

const app= express();
const PORT= process.env.PORT||3001;

// Set up Handlebars.js engine with custom helpers
const hbs=exphbs.create({helpers});

// Inform Express.js on which template engine to use

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({entended:true}));
app.use(express.static(path.join(__dirname,'public')));


