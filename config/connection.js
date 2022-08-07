require('dotenv').config;
const mongoose = require('mongoose')

mongoose.connect(process.env.LOCAL_DB_URL)
.then(()=>{console.log('connection succesffulty');})
.catch((err)=>{console.log(err);})