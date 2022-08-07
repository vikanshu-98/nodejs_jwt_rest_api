
require('dotenv').config()
const express  = require('express') 
const app      = express()
const port     = process.env.PORT||3300

const initRoutes = require('./routes/api') 

require('./config/connection') 

// custom middleware
const responseMacro =require('./app/http/middleware/responseMacro')
responseMacro(app)
const errorHandlingMiddleware = require('./app/http/middleware/errorHandlingMiddleware')
errorHandlingMiddleware(app)



app.use(express.json())
app.use(express.urlencoded({extended:false}))  
initRoutes(app)


app.use( (err,req,res,next)=>{
    res.status(err.status||500).send({error:{"status":err.status||500,"message":err.message}})
})  

app.listen(port,()=>{
    console.log(`listen port number is ${port}`);
})